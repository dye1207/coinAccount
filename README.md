# 프로젝트: coinAccount
프로젝트 한줄 소개: 두개 이상의 코인 거래소를 사용하는 고객의 자산 평가금액을 볼 수 있는 자산 홈페이지를 제작하였습니다.
제작 기간: 23.07.22 ~ 23.08.28
개발도구: REST API Mock Server, Node.js, express, Vue.js, Bithumb api, Upbit api
개발인원: 1명   
git: github.com/dye1207/coinAccount 

## 개요
- Bithumb과 Upbit API 보유자산 조회를 axios 통신하여 통합된 자산 평가금액 E-charts로 구현
- 거래소 API Access Key와 Secret Key를 secret.js에 export하여 암호화
- echarts를 이용한 ux 친화적인 그래프 구현

## 주기능   
[] 차트 조회  
[] 도넛형 그래프
[] 자산 내림차순 오름차순 조회
   
## 사용한 기술      
* express 를 이용한 서버 구현   
* ejs를 이용한 서버 랜더링 구현
* 환경변수로 secret.js에 민감정보 저장
