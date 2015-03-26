<?php

/*
* Auth class
* Works with PHP 5.5 and above.
*/

class Auth
{
	private $cookie_name;
	private $cookie_path;
	private $cookie_domain;
	private $cookie_secure;
	private $cookie_http;
	private $bcrypt_cost;
	private $cookie_remember;
	private $site_key;


	/*
	* Initiates database connection
	*/

	public function __construct()
	{
		$this->cookie_name = "authID";
		$this->cookie_path = "/";
		$this->cookie_domain = "";
		$this->cookie_secure = 0;
		$this->cookie_http = 0;
		$this->bcrypt_cost = 10;
		$this->cookie_remember = "+1 week";
		$this->cookie_forget = "+30 minutes";
		$this->site_key = "s.)f1c96e689/%d7815696ecbf1c96e6894b779456d330e";
	}

	public function getCookieName() {
		return $this->cookie_name;
	}

	/*
	* Logs a user in
	* @param string $username
	* @param string $password
	* @param bool $remember
	* @return array $return
	*/

	public function login($username, $password, $remember = 0)
	{
		$return['error'] = 1;

		if ($this->isBlocked()) {
			$return['message'] = "user_blocked";

			return $return;
		}

		$member = ORM::for_table('member')->where('name', $username)->use_id_column('mId')->find_one();
		if(!$member) {
			$this->addAttempt();

			$return['message'] = "username_password_incorrect";
			return $return;
		}
		
		if (!password_verify($password, $member->password)) {
			$this->addAttempt();

			$return['message'] = "username_password_incorrect";
			return $return;
		}

		$sessiondata = $this->addSession($member, $remember);

		if($sessiondata == false) {
			$return['message'] = "system_error";
			return $return;
		}

		setcookie($this->cookie_name, $sessiondata['hash'], $sessiondata['expiretime'], $this->cookie_path, $this->cookie_domain, $this->cookie_secure, $this->cookie_http);
		
		$return['error'] = 0;
		$return['message'] = "logged_in";

		$return['hash'] = $sessiondata['hash'];
		$return['expire'] = $sessiondata['expiretime'];

		return $return;
	}

	/*
	* Logs out the session, identified by hash
	* @param string $hash
	* @return boolean
	*/

	public function logout($hash)
	{
		if (strlen($hash) != 40) {
			return false;
		}

		return $this->deleteSession($hash);
	}

	/*
	* Creates a session for a specified user id
	* @param int $uid
	* @param boolean $remember
	* @return array $data
	*/

	private function addSession($member, $remember)
	{
		$ip = $this->getIp();
		
		if(!$member) {
			return false;
		}

		$data['hash'] = sha1($member->salt . microtime());
		$agent = $_SERVER['HTTP_USER_AGENT'];

		$this->deleteExistingSessions($member->mId);

		if($remember == true) {
			$data['expire'] = date("Y-m-d H:i:s", strtotime($this->cookie_remember));
			$data['expiretime'] = strtotime($data['expire']);
		} else {
			$data['expire'] = date("Y-m-d H:i:s", strtotime($this->cookie_forget));
			$data['expiretime'] = 0;
		}

		$data['cookie_crc'] = sha1($data['hash'] . $this->site_key);

		$session = ORM::for_table('sessions')->create();
		$session->uid = $member->mId;
		$session->hash = $data['hash'];
		$session->expiredate = $data['expire'];
		$session->ip = $ip;
		$session->agent = $agent;
		$session->cookie_crc = $data['cookie_crc'];
		if(!$session->save()) return false; //abort if save was not successful
		
		$data['expire'] = strtotime($data['expire']);
		return $data;
	}

	/*
	* Removes all existing sessions for a given UID
	* @param int $uid
	* @return boolean
	*/

	private function deleteExistingSessions($uid)
	{
		return ORM::for_table('sessions')->where('uid', $uid)->delete_many();
	}

	/*
	* Removes a session based on hash
	* @param string $hash
	* @return boolean
	*/

	private function deleteSession($hash)
	{
		return ORM::for_table('sessions')->where('hash', $hash)->delete_many();
	}

	/*
	* Function to check if a session is valid
	* @param string $hash
	* @return boolean
	*/

	public function checkSession($hash)
	{
		$ip = $this->getIp();

		if ($this->isBlocked()) {
			return false;
		}
		
		if (strlen($hash) != 40) {
			return false;
		}

		$session = ORM::for_table('sessions')->where('hash', $hash)->find_one();

		if (!$session) {
			return false;
		}

		$sid = $session->id;
		$uid = $session->uid;
		$expiredate = strtotime($session->expiredate);
		$currentdate = strtotime(date("Y-m-d H:i:s"));
		$db_ip = $session->ip;
		$db_agent = $session->agent;
		$db_cookie = $session->cookie_crc;
		
		if ($currentdate > $expiredate) {
			$this->deleteExistingSessions($uid);

			return false;
		}
		
		if ($ip != $db_ip) {
			if ($_SERVER['HTTP_USER_AGENT'] != $db_agent) {
				$this->deleteExistingSessions($uid);

				return false;
			}
			
			return $this->updateSessionIp($sid, $ip);
		}
		
		if ($db_cookie == sha1($hash . $this->site_key)) {
			return true;
		}
		
		return false;
	}

	/*
	* Updates the IP of a session (used if IP has changed, but agent has remained unchanged)
	* @param int $sid
	* @param string $ip
	* @return boolean
	*/

	private function updateSessionIp($sid, $ip)
	{
		$session = ORM::for_table('sessions')->where('id', $sid)->find_one();
		$session->ip = $ip;
		return $session->save();
	}

	/*
	* Informs if a user is locked out
	* @return boolean
	*/

	private function isBlocked()
	{
		$ip = $this->getIp();

		$attempt = ORM::for_table('attempts')->where('ip', $ip)->find_one();

		if(!$attempt) {
			return false;
		}

		$expiredate = strtotime($attempt->expiredate);
		$currentdate = strtotime(date("Y-m-d H:i:s"));

		if ($attempt->count == 5) {
			if ($currentdate < $expiredate) {
				return true;
			}

			$this->deleteAttempts($ip);
			return false;
		}

		if ($currentdate > $expiredate) {
			$this->deleteAttempts($ip);
		}

		return false;
	}

	/*
	* Adds an attempt to database
	* @return boolean
	*/

	private function addAttempt()
	{
		$ip = $this->getIp();

		$attempt = ORM::for_table('attempts')->where('ip', $ip)->find_one();
		
		$attempt_expiredate = date("Y-m-d H:i:s", strtotime("+30 minutes"));
		
		if (!$attempt) {
			$attempt_count = 1;

			$attempt = ORM::for_table('attempts')->create();
			$attempt->ip = $ip;
			$attempt->expiredate = $attempt_expiredate;
		}
		
		$attempt_count = $attempt->count + 1;
		
		$attempt->count = $attempt_count;

		$attempt->save();
	}

	/*
	* Deletes all attempts for a given IP from database
	* @param string $ip
	* @return boolean
	*/

	private function deleteAttempts($ip)
	{
		return ORM::for_table('attempts')->where('ip', $ip)->delete_many();
	}

	/*
	* Returns IP address
	* @return string $ip
	*/

	private function getIp()
	{
		return $_SERVER['REMOTE_ADDR'];
	}
}

?>
