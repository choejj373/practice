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
        
    + jwt 적용
        + 로그인시 token을 발급하여 cookie에 저장해둠
        + token이 없거나 expired 된 token인 경우 재 로그인
        + access token 과 refreh token으로 분리 : todo
    
    + MySql
        + connection, connection pool 
        + call query, call sp
        + transaction
        + scheduler
            
    + redis
        + session 저장
        + DB Caching : 아이템 관련만 적용( hash )
    
    + linux( centOS) / google cloud platform
        - node js 설치(+npm)
        - mysql 설치(8.0)
        - github에서 소스 가져오기
        - multiplayserver 실행
        - 최신 버젼들로 업데이트 : todo

    + LogSystem 
        + Winston

    + 게임 기본 기능 => XX 특공대 모작중
        + http
        + 유저 정보
            + 5분마다 배틀 코인 충전( 최대 100 )

        + 상점창 기능
            + 일일 상점 
                + 무료 다이아 얻기
            + 다이아 상점
                + 부위별 아이템 구입
        
        + 장비창 기능
            + 전체 아이템 리스트 보기
            + 장착된 아이템 보기
            + 장착/탈착 기능

    + 싱글 플레이 게임
        + http
        + 게임 시작 : POST
            + 배틀 코인 차감
        + 게임 종료 : DELETE
            + 게임 클리어시 보상(게임 머니)


    + 멀티 플레이 게임
        + https://github.com/choejj373/multigame
        + node js 로만 구현해봄 (feat. socket.io)
        + 매치 메이킹 서버
            + 일정 인원수(현재는 2인)가 매칭을 요청하면 방 생성하는 간단한 메이킹
        + 멀티 플레이 서버 
            + 매칭된 클라이언트가 모두 접속하면 게임이 시작되고 일정 시간이 지나면 게임 종료
        
        + 간단한 서버 주도형 멀티 게임(pve) : ing

    + 채팅 
        + Websocket
        + 로그인된 클라이언트간 채팅


+ 작업중
    + 라우터 정리

    + XX 특공대 모작중
        + 상점창 기능
            + 일일 상점 : 매일 정해진 시간에 reset
                + 골드 구입 아이템(todo)

            + 다이아 구입

        + 장비창 기능
            + 버리기

+ TODO
    + typescript
    + protobuf
    + 관리 기능
        + user 삭제 - account 와 item 동시 삭제 
    + LogSystem : Morgan
    + 우편 시스템 
    + 공지
    + 채팅  
        + 길드 채팅 
    + redis
        + 랭킹( sorted set )
    + gcp
        + ftp 연결

    + 싱글 플레이 게임
        + 게임 시작시 Session에 게임 시작 정보 저장
        + 게임 중간에 일정시간 마다 클라->서버 자원 습득 요청 : PUT
            + Session에 싱글 게임중인 경우에만 허용
            + 해당 스테이지에서 일정 시간당 얻을수 있는 자원 제한 내에서만 허용
        + 게임 종료시 나머지 시간동안 얻었던 자원 습득 요청
            + Session에 싱글 게임 종료 저장

    + 멀티 게임 
        + 멀티 플레이 서버로의 접속 보안 강화
            + 멀티 플레이 서버에서 방생성시 userid, 생성된 roomid, pwd를 보관한다.
            + 해당 정보를 싱글 플레이 서버에서 받아 클라이언트는 멀티 플레이 서버 접속시 인증 및 Join 요청
            
        + 간단한 멀티 게임
            + 서버에서 관리되는 간단한 보드 게임 제작

    + 보안
        + https
        + websocket도 별도 암호화 필요하다.
        
    + 구글 계정으로 가입 및 로그인

    + 빌링
