# 设置基础镜像
FROM nginx
# 将本地dist文件夹中的内容复制到 容器的/usr/share/nginx/html/ 这个目录下面
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'echo init ok!!'