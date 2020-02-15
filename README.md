# nodebird-api
- 인증을 받은 사용자에게만 일정한 할당량안에서 api를 호출할수있도록 허용
- 다른서비스에 nodebird서비스의 게시글, 해시태그, 사용자정보를 json형식으로 제공

## v0.1
- 아래와 같이 프로젝트를 사용할 예정

| 프로젝트 | 포트 |  |
|---|:---:|:---:|
| nodebird | 3000 | 앱서버 |
| nodebird-api | 3001 | 다른 서비스가 nodebird의 데이터나 서비스를 이용할 수 있도록 창구를 만든 것 |
| nodebird-call | 3002 | 추후에 만들 클라이언트 |

- 등록한 도메인에서만 API를 사용할 수 있게 도메인을 등록하는 기능

## v0.2
- nodebird앱이 아닌 다른 클라이언트가 nodebird의 데이터를 가져갈 수 있게 해야 하는 만큼 별도의 인증과정을 필요로 한다.
    - jwt(json web token)토큰을 사용하여 인증하는 방법을 사용한다.
    - jwt : json형식의 데이터를 저장하는 토큰. jwt 비밀키를 알지 않는 이상 변조가 불가능. 내용을 볼 수 있기때문에 민감한 내용을 넣어선 안됨. 사용자이름, 권한등의 외부에 노출되어도 좋은 정보에 한해서 사용. 용량이 큼.
        - 헤더 : 토큰종류, 해시알고리즘정보가 들어있다.
        - 페이로드 : 토큰의 내용물이 인코딩된 부분
        - 시그니처 : 일련의 문자열. 시그니처를 통해 토큰이 변조되었는지 여부를 확인할 수 있다. jwt비밀키로 만들어짐

- jwt 모듈 설치 및 설정
    - `npm i jsonwebtoken`
    - .env파일에 JWT_SECRET를 추가
    - 토큰을 비교할 미들웨어를 추가
    - 토큰 발급 라우터(POST /v1/test)와 사용자가 토큰을 테스트해볼 수 있는 라우터(GET /v1/test)를 생성
        - v1 : 버전1 => 한 번 버전이 정해진 후에는 라우터를 함부로 수정하면 안됨. 다른사람이 기존 API를 쓰고 있음을 염두에 두어야 함


## v0.3
- sns API 서버 만들기
    - /posts/my(내가 올린 포스터 가져오기), /posts/hashtag/:title(해시태그 검색 결과를 가져오기) 라우터 추가

## v0.4
- 일정 기간 내에 API를 사용할 수 있는 횟수를 제한해서 서버의 트랙픽 줄이기
- `npm i express-rate-limit`
- apiLimiter 미들웨어 추가
- nodebird API 응답목록

| 응답코드 | 메시지 |
|---|:---:|
| 200 | JSON 데이터입니다. |
| 401 | 유효하지 않은 토큰입니다. |
| 410 | 새로운 버전이 나왔습니다. 새로운 버전을 사용하세요. |
| 419 | 토큰이 만료되었습니다. |
| 429 | 1분에 한 번만 요청할 수 있습니다. |

- 사용량 제한이 추가되었으므로 기존 API버전과 호환이 되지 않는다. 따라서 v2라우터를 생성한다. 또한 v1은 deprecated한다.
