# Node.js 관련 모바일 게임 프로젝트( 연습용 )
+ 개발 환경
    + Node.js, mysql - windows : local
    + redis  - linux : google cloud platform
    + github

+ 구현된 기능
    + 회원 가입 및 로그인 
        + 회원 정보는 MySql에 저장 
        + 패스워드 암호화

    + Session
        + mysql, memchached, redis, memory store 테스트 완료
        
    + 채팅 
        + Websocket
        + 로그인된 클라이언트간 채팅

    + MySql
        + connection, connection pool 
        + call query, call sp
        + transaction
            
    + redis
        + sessin 저장
    
    + 게임 기본 기능
        + http
        + 인벤토리 - 전체 아이템 보기, 아이템 팔기
        + 상점 - 아이템 구입
        + 게임 머니 증/차감 

    + 싱글 플레이 게임
        + http
        + 게임 시작 : POST
            + 배틀 코인 차감
        + 게임 종료 : DELETE
            + 게임 클리어시 보상(게임 머니)


    + 멀티 플레이를 위한 서버간 이동 구현 테스트
        + node js 로만 구현해봄 (feat. socket.io)
        + 간단한 매치 메이킹
        + https://github.com/choejj373/multigame


+ 작업중
    + redis
        + DB Caching         

    + 멀티 플레이
        + 서버 이동후 채팅룸 조인

+ TODO
    + 싱글 플레이 게임
        + 게임 시작시 Session에 게임 시작 정보 저장
        + 게임 중간에 일정시간 마다 클라->서버 자원 습득 요청 : PUT
            + Session에 싱글 게임중인 경우에만 허용
            + 해당 스테이지에서 일정 시간당 얻을수 있는 자원 제한 내에서만 허용
        + 게임 종료시 나머지 시간동안 얻었던 자원 습득 요청
            + Session에 싱글 게임 종료 저장

    + 관리 기능
        + user 삭제 - account 와 item 동시 삭제 

    + LogSystem : Winston

    + 우편 시스템
        + DB
            + mail_table
            + mail_attached_item_table
        + 우편 보기
        + 우편 보내기
            + 알림
        + 공지( 별도 시스템으로 ?)
    
    + 채팅  
        + 길드 채팅 

    + 멀티 게임 
        + 세부적인 매치 메이킹과 멀티 서버 구현 필요 : pve or pvp
        + 멀티 플레이 서버로의 접속 보안 강화
            + 멀티 플레이 서버에서 방생성시 userid, 생성된 roomid, pwd를 보관한다.
            + 해당 정보를 싱글 플레이 서버에서 받아 클라이언트는 멀티 플레이 서버 접속시 인증 및 Join 요청

    + 보안
        + https
        + websocket은 별도 암호화 필요한가?
        
    + 구글 계정으로 가입 및 로그인

    + 빌링
