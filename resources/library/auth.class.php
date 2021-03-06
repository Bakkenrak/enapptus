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

	public function login($userId, $password, $remember = 0)
	{
		if ($this->isBlocked()) {
			return Array(Array('error' => "Too many failed login attempts. Wait half an hour."), 401);
		}

		$member = ORM::for_table('member')->use_id_column('mId')->find_one($userId);
		if(!$member) {
			$this->addAttempt();

			return Array(Array('error' => "Username or password incorrect."), 401);
		}
		
		if (!password_verify($password, $member->password)) {
			$this->addAttempt();

			return Array(Array('error' => "Username or password incorrect."), 401);
		}

		$sessiondata = $this->addSession($member, $remember);

		if($sessiondata == false) {
			return Array(Array('error' => "Failed to create session."), 401);
		}

		setcookie($this->cookie_name, $sessiondata['hash'], $sessiondata['expiretime'], $this->cookie_path, $this->cookie_domain, $this->cookie_secure, $this->cookie_http);

		return Array(Array('info' => "Logged in successfully.", 'mId' => $member->mId, 'member' => $member->name, 'hash' => $sessiondata['hash'], 'admin' => $member->admin), 200);
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
		$session->remember = ($remember === true || $remember === 1 || $remember === "true") ? true : false;
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

	public function authenticate($admin = false) {
		if(!isset($_COOKIE[$this->cookie_name])) {
			throw new Exception('No session provided', 401);
		} else {
			$mId = $this->checkSession($_COOKIE[$this->cookie_name]);
			if(!$mId) {
				throw new Exception('Invalid session', 401);
			}
			if($admin){
				$member = ORM::for_table('member')->use_id_column('mId')->find_one($mId);
				if(!$member->admin){
					throw new Exception('Member is no admin', 401);
				}
			}
			return $mId;
		}
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
			
			$this->updateSessionIp($sid, $ip);
		}
		
		if ($db_cookie == sha1($hash . $this->site_key)) {
			$this->updateSessionExpiration($session);
			return $uid;
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
	* Extends the expiration date for short-term cookies (that are not to be remembered).
	* This avoids the sudden logout when using the app just beyond the expiration span.
	*/
	private function updateSessionExpiration($session){
		if(!$session->remember){
			$session->expiredate = date("Y-m-d H:i:s", strtotime($this->cookie_forget));
			$session->save();
		}
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

		if ($attempt->count == 10) {
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
