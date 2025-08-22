# Casino Chip Manager (Backend)

このリポジトリは、学校祭用のカジノチップ管理システムのバックエンド実装です。  
Node.js、Express、PostgreSQL、Docker Compose、CI/CD を組み合わせて、高い再現性と自動化を実現しています。

## 前提条件

- Docker Engine / Docker Compose がインストール済み
- Node.js 18.x（ローカル開発環境での直接実行時）
- PostgreSQL 15（ローカル、または Docker 内部）

## クローン & 環境構築

```bash
git clone https://github.com/your-org/casino-chip-manager.git
cd casino-chip-manager
cp .env.example .env