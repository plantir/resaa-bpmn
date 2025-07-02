#add some comment
FROM docker.resaa.net/node:20-alpine AS build

WORKDIR /app
COPY . .
RUN yarn
ENV VITE_BASE_URL=http://bpmn.cloudpbx.mcci.local
ENV VITE_API_URL=http://mockapi.cloudpbx.mcci.local
ENV VITE_BPMN_URL=http://bpmn.cloudpbx.mcci.local
ENV VITE_MINIO_URL=http://minio.bss.cloudpbx.mcci.local
ENV VITE_MOCK_URL=http://mockapi.bss.cloudpbx.mcci.local
ENV VITE_CAS_URL=http://cas.bss.cloudpbx.mcci.local 
ENV VITE_HSS_URL=http://hss.bss.cloudpbx.mcci.local 
ENV VITE_CCFC_URL=http://ccfc.bss.cloudpbx.mcci.local 
ENV VITE_SAF_URL=http://saf.bss.cloudpbx.mcci.local 
ENV VITE_DS_URL=http://ds.bss.cloudpbx.mcci.local 
ENV VITE_RRFC_URL=http://rrfc.bss.cloudpbx.mcci.local 
ENV VITE_VMAFC_URL=http://vmafc.bss.cloudpbx.mcci.local 
ENV VITE_VMAFU_URL=http://vmafu.bss.cloudpbx.mcci.local 
ENV VITE_MINIO_URL=http://minio.bss.cloudpbx.mcci.local 
ENV VITE_PROMETHEUS_URL=http://prometheus.bss.cloudpbx.mcci.local 
ENV VITE_ACF_URL=http://acf.bss.cloudpbx.mcci.local 
ENV VITE_CKF_URL=http://ckf.bss.cloudpbx.mcci.local 
ENV VITE_CJRF_URL=http://cjrf.bss.cloudpbx.mcci.local
RUN yarn build

FROM docker.resaa.net/node:18-alpine AS deploy-node

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN yarn --prod
EXPOSE 3000
CMD ["node","index.js"]