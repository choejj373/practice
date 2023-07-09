# Node.js 관련 모바일 게임 서버 프로젝트( 연습용 )
+ 개발 환경
    + Node.js, mysql    on windows : local
    + redis             on linux : google cloud platform
    + github
    ===>
    + Node.js, mysql    on linux : google cloud platform
    + github
    + redis 는 잠시 대기중

+ 구현된 기능
    + node js addon c++( ~ing )

    + 계정 등록 및 로그인 
        + Guest Login
        + Google Login
        + 패스워드 암호화
        + 로그인시 비대칭 암호화 적용

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
        - 실행/접속
        - 최신 버젼들로 업데이트 : todo

    + LogSystem 
        + Winston

    + 게임 기본 기능
        + http만 사용

        + 상점창 기능
            + 일일 상점 : 하루에 한번만 가능( agent -> expire_time와 now_time 비교하여 처리 )
                + 무료 다이아 얻기
            + 다이아 상점
                + 부위별 아이템 구입
        
        + 장비창 기능
            + 전체 아이템 리스트 보기
            + 장착된 아이템 보기
            + 장착/탈착 기능
            + 아이템 팔기

        + 전투창 기능
            + 퀘스트(일일/주간/일반)
                + 퀘스트 
                    + 로그인 횟수 
                    + 다이아 소모량
                + 보상 : 다이아, 골드, 아이템
                + 일반 퀘스트의 경우 연계 퀘스트 적용( 기존 퀘스트는 지우고 연계 퀘스트 등록 )
            + 싱글 플레이 자동 전투(~ing)
                

    + 싱글 플레이 게임 => 방치형 자동 전투
        + http
        + 수동 시작/정지로 한번의 자동 전투 구현

    + 멀티 플레이 게임
        + https://github.com/choejj373/multigame
        + node js 로만 구현해봄 (feat. socket.io)
        + 매치 메이킹 서버
            + 일정 인원수(현재는 2인)가 매칭을 요청하면 방 생성하는 간단한 메이킹
        + 멀티 플레이 서버 
            + 매칭된 클라이언트가 모두 접속하면 게임이 시작되고 일정 시간이 지나면 게임 종료
        
        + 간단한 서버 주도형 멀티 게임(pve) : ~ing

    + 채팅 
        + Websocket
        + 로그인된 클라이언트간 채팅


+ 작업중
    + Google Login된 유저의 계정 생성 및 로그인 처리(토큰 생성등) 추가

    + node js addon c++ : 전투 결과 검증을 좀 더 빠르게 하기 위해
        + 간단한 전투 시뮬을 10만번 loop 돌릴시 생각 보다 많은 차이가 났다.
            + javascript : 100~150ms
            + addon c++  : 10~20ms
        + addon c++ & ( 비동기 or thread )는 필수일듯 하다.


    + 싱글 플레이 게임(방치형)
        + 자동 전투
        + 전투 후 서버에서 검증
        + 일정 시간마다 골드/경험치 자동 습득
        + 캐릭터 스탯



+ TODO
    + 전투창 기능
        + 퀘스트
            + 완료한 퀘스트 정보를 저장해두자.
                + 바이너리 or 별도의 테이블 (todo)
            + 스테이지 클리어 퀘스트 : ~ ing
            + 퀘스트 완료 제한 조건 체크
            + 일일
                + 로그인 횟수 체크 퀘스트
                    + 시간 만료된 퀘스트의 reset을 quest 정보를 가져올때 처리했더니 로그인을 한번더 해야 되는 케이스
        + 공지
    + 상점창 기능
        + 일일 상점 
            + agent를 사용하지 말고 거래 시간을 기입해 두고 만료 체크를 하는 방식으로 변경해보자( 완료 )
            + 골드 구입 아이템
        + 다이아 구입

    + typescript
    + protobuf
    + 관리 기능
        + user 삭제 - account 와 item 동시 삭제 
    + LogSystem : Morgan
    + 우편 시스템 
    + 채팅  
        + 길드 채팅 
    + redis
        + 랭킹( sorted set )
    + gcp
        + ftp 연결

    + 싱글 플레이 게임
        + 방치형 게임으로 만들어 보자

    + 멀티 게임 
        + 방치형 게임은 멀티가 어떤식으로 하나 찾아보자.
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
