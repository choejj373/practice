# Node.js 관련 연습용 프로젝트

## 구현 완료된 기능

### 회원 가입 및 로그인 - MySql에 저장 및 체크

### 로그인된 클라이언트간 채팅 - Websocket

### 패스워드 저장시 암호화

### Session
#### mysql에 저장
#### 로그인중 체크 ( 메인 페이지나 채팅 페이지 접속시 인증 안되있다면 로그인 페이지로)
#### 자동 만료 - sessions table에 표시된 시간은 timezone 적용 안된 시간

### MySql
#### call sp
#### connection pool

### 멀티 게임 
#### 매치메이크 서버, 멀티 게임 서버 
##### node.js로 구현
##### 기본 구현 가능성만 테스트

## 작업중
### 싱글 게임 
#### 상점, 인벤토리
##### Item Table 생성( item_uid(pk), item_index, owner(fk) )
##### Session에 user_id 추가
##### 인벤토리 화면에서 전체 Item List 보여주기

##### 상점에서 아이템 구입시 Item Table에 추가

### 관리 기능
#### user 삭제
##### account 와 item 동시 삭제 

## TODO
### LogSystem
#### Winston

### 채팅
#### 채팅방

### 멀티 게임 
#### 세부적인 매치 메이킹과 멀티 서버 구현 필요

### 구글 계정으로 가입 및 로그인

### 빌링

### MySql
#### transaction ( sp 내에서 )