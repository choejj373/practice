# Node.js 관련 모바일 게임 서버 프로젝트( 연습용 )
+ 개발 환경
    + Node.js, mysql    on windows : local
    + redis             on linux : google cloud platform
    + github

+ 구현된 기능
    + 회원 가입 및 로그인 
        + 회원 정보는 MySql에 저장 
        + 패스워드 암호화

    + Session
        + mysql, memchached, redis, memory store 테스트 완료
        + http session 과 socket.io 연동
        
    + 채팅 
        + Websocket
        + 로그인된 클라이언트간 채팅

    + MySql
        + connection, connection pool 
        + call query, call sp
        + transaction
            
    + redis
        + session 저장
        + DB Caching : 아이템 관련만 적용( hash )
    
    + LogSystem 
        + Winston

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


    + 멀티 플레이 게임
        + https://github.com/choejj373/multigame
        + node js 로만 구현해봄 (feat. socket.io)
        + 매치 메이킹 서버와 멀티 플레이 서버 추가 구성
        + 간단한 매치 메이킹, 간단한 서버 주도형 멀티 게임(pve)
        

+ 작업중
    + 매치 메이킹 서버/멀티 플레이 서버와 연동중

    + 멀티 플레이 게임

    + 소스 정리 및 리펙토링

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

    + LogSystem : Morgan

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
        + 멀티 플레이 서버로의 접속 보안 강화
            + 멀티 플레이 서버에서 방생성시 userid, 생성된 roomid, pwd를 보관한다.
            + 해당 정보를 싱글 플레이 서버에서 받아 클라이언트는 멀티 플레이 서버 접속시 인증 및 Join 요청
            
        + 간단한 멀티 게임
            + 서버에서 관리되는 간단한 보드 게임 제작
    + redis
        + 랭킹( sorted set )
    
    + linux
        + node js 설치

    + gcp
        + ftp 연결

    + 보안
        + https
        + websocket은 별도 암호화 필요한가?
        
    + 구글 계정으로 가입 및 로그인

    + 빌링
