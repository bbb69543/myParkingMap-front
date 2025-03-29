# 使用 Node.js 作為基礎映像
FROM node:23-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm install

# 複製專案檔案
COPY . .


# 開啟 Vite Dev Server，並監聽所有網路介面
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]