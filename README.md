# Node.js 관련 연습용 프로젝트

+ 구현 완료된 기능
    + 회원 가입 및 로그인 
        + MySql에 저장 
        + 패스워드 암호화

    + Session
        + mysql, memchached 저장소 테스트 완료
        + 자동 만료 테스트 완
        
    + 채팅 
        + Websocket
        + 로그인된 클라이언트간 채팅 : 서버내 전체 채팅

    + MySql
        + connection, connection pool 
        + call query, call sp

    + 싱글 플레이 게임
        + 인벤토리 - 전체 아이템 보기, 아이템 팔기
        + 상점 - 아이템 구입

    + 멀티 플레이를 위한 서버간 이동 구현 테스트
        + node js 로만 구현해봄
        + https://github.com/choejj373/multigame


+ 작업중
    + 멀티 플레이 서버로의 접속 보안 강화
        + 멀티 플레이 서버에서 방생성시 userid, 생성된 roomid, pwd를 보관한다.
        + 해당 정보를 싱글 플레이 서버에서 받아 클라이언트는 멀티 플레이 서버 접속시 인증 및 Join 요청

+ TODO
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

    + redis
        + linux 혹은 windows 64bit 설치 필요

    + 구글 계정으로 가입 및 로그인

    + 빌링
