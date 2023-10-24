# EC2インスタンスを起動
Amazon Linux 2023 AMI を使ってみる.
キーペアでは新しいSSHキーを作ってみる.

# sshキーは取得してローカルにおいておく
pemファイルの名前を`WebServerTestKey.pem`とする.
`C:\ssh\WebServerTestKey.pem`に配置する.(仕様が分かっていれば任意のフォルダで良い.)

また,権限が緩いとログインに使用できないため,厳しく設定しておく.
`updateKeyPermission.bat`を`C:\ssh`に配置する.
``` bat
@echo off
setlocal

:: SSHキーファイルのパスを変数に設定
set KEY_PATH=C:\ssh
set KEY_FILE_NAME=WebServerTestKey.pem

cd %KEY_PATH%
icacls %KEY_FILE_NAME% /inheritance:r
icacls %KEY_FILE_NAME% /grant:r "%username%:R"
echo Permissions for %KEY_FILE_NAME% have been updated.

endlocal
pause
```
batファイルを実行することで,pemの権限が変更される.

## EC2インスタンスへログイン
コマンドプロンプトを開き,以下のコマンドを入力
C:\Users\user-name>ssh -i C:\ssh\WebServerTestKey.pem ec2-user@11.222.333.444
11.222.333.444 部分は起動したインスタンスのグローバルIP(パブリック)

### ネットへの接続確認
[ec2-user@ip-172-11-22-33 ~]$ ping www.google.co.jp
  PING www.google.co.jp (142.251.222.3) 56(84) bytes of data.
  64 bytes from nrt13s71-in-f3.1e100.net (142.251.222.3): icmp_seq=312 ttl=114 time=2.16 ms
  64 bytes from nrt13s71-in-f3.1e100.net (142.251.222.3): icmp_seq=312 ttl=114 time=2.16 ms
...
Ctrl + C でチェック終了

表示されない場合は,セキュリティグループの設定が間違っている可能性が高い.

## Githubレポジトリからクローンするために,Gitをインストール

[ec2-user@ip-172-11-22-33 /]$ sudo yum update -y
[ec2-user@ip-172-11-22-33 /]$ sudo yum install git -y

[ec2-user@ip-172-11-22-33 ~]$ cd /home
[ec2-user@ip-172-11-22-33 home]$ sudo mkdir server
[ec2-user@ip-172-11-22-33 home]$ cd server
[ec2-user@ip-172-11-22-33 server]$ sudo git clone https://github.com/flyaway2525/Web-Server /home/server

<details><summary>Ansibleのインストール(一旦見送られたのでコメントアウト)</summary>

``` md memo
# Ansible関連のインストールは手間がかかり,現状node関連しか入れないので,Ansibleを使用しないことにしました.
## AnsibleインストールのためのPythonとpipのインストール
[ec2-user@ip-172-11-22-33 server]$ sudo dnf install python3.11 -y
[ec2-user@ip-172-11-22-33 server]$ sudo dnf install python3-pip -y

## Ansibleのインストール
[ec2-user@ip-172-11-22-33 server]$ pip install ansible
[ec2-user@ip-172-11-22-33 server]$ cd ansible
以降 playbookを実行できるようになる.
```

</details>

## nodeのインストール
[ec2-user@ip-172-11-22-33 ansible]$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
[ec2-user@ip-172-11-22-33 ansible]$ exit
 - インスタンスに入りなおす必要がある.
C:\Users\user-name>ssh -i C:\ssh\WebServerTestKey.pem ec2-user@11.222.333.444
[ec2-user@ip-172-11-22-33 ~]$ nvm install 18
 - TODO : バージョンの精査

## NextJSサーバーの起動
[ec2-user@ip-172-11-22-33 ~]$ cd /home/server/app

TODO : これいらないかも,次回作業で検証すること.
[ec2-user@ip-172-11-22-33 app]$ echo "export PATH=$PATH:~/.nvm/versions/node/v18.18.0/bin/" >> ~/.bashrc && source ~/.bashrc

npm installの実行
[ec2-user@ip-172-11-22-33 app]$ sudo env "PATH=$PATH" ~/.nvm/versions/node/v18.18.0/bin/npm install

一部のファイルのアクセス権限がないため付与
[ec2-user@ip-172-11-22-33 app]$ sudo chown -R ec2-user:ec2-user /home/server/app
NextJSサーバーの起動
[ec2-user@ip-172-11-22-33 app]$ npm run dev

Ctrl + C で抜けるとサーバーも閉じる.
閉じないようにするためには,`npm run dev &`でバックグラウンドで実行する.
