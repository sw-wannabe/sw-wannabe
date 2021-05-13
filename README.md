# SW-WANNABE

여러 유저가 동시에 한 컨테이너에서 작업하는 방법
```
sudo useradd -m [사용자 이름]
```
을 통해서 팀원별로 유저 추가
```
sudo passwd [사용자 이름]
```
을 통해서 암호 설정
```
gitinit.sh
```
를 통해서 깃 리포 초기화 수행. 위 스크립트는
1. 한 리포 내에서 리포 소유자가 아닌 리포 소유 그룹의 모두가 작업을 할 수 있도록 허용하고
2. 리포의 소유 그룹을 sudo 그룹으로 바꾸고
3. 리포 내 파일들의 유저 그룹 수정 권한을 추가\

하는 스크립트입니다.
