import { useState } from "react";
import "./App.css";

const sections = [
  {
    id: "docker",
    name: "Docker",
    cards: [
      {
        question: "CMD vs ENTRYPOINT — в чём разница и как работает?",
        answer: (
          <>
            <ul>
              <li>
                <b>ENTRYPOINT</b> — главная команда, почти всегда выполняется.
              </li>
              <li>
                <b>CMD</b> — команда или аргументы по умолчанию, которые можно
                полностью заменить.
              </li>
            </ul>

            <p>Пример:</p>

            <pre>
              <code>{`ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]`}</code>
            </pre>

            <ul>
              <li>
                <code>docker run image</code> → nginx -g "daemon off;"
              </li>
              <li>
                <code>docker run image -g "daemon on;"</code> → nginx -g
                "daemon on;"
              </li>
            </ul>

            <p>
              Если используется только <b>CMD</b>, то{" "}
              <code>docker run image bash</code> полностью заменит команду.
            </p>
          </>
        ),
      },

      {
        question: "Volume vs Bind Mount — как работают?",
        answer: (
          <>
            <p>
              <b>Volume</b> — Docker сам создаёт и управляет хранилищем.
            </p>

            <pre>
              <code>{`docker volume create data
docker run -v data:/app/db postgres`}</code>
            </pre>

            <p>
              Данные обычно живут в <code>/var/lib/docker/volumes/</code>.
            </p>

            <hr />

            <p>
              <b>Bind Mount</b> — монтируешь папку с хоста напрямую в контейнер.
            </p>

            <pre>
              <code>docker run -v /home/user/code:/app nginx</code>
            </pre>

            <p>Изменения на хосте сразу видны внутри контейнера.</p>
          </>
        ),
      },

      {
        question: "Как устроена сеть в Docker? Базовые драйверы",
        answer: (
          <>
            <p>
              Docker создаёт виртуальные сети. Контейнеры получают IP внутри них.
            </p>

            <ul>
              <li>
                <b>bridge</b> — используется по умолчанию. Изолированная сеть +
                NAT.
              </li>
              <li>
                <b>host</b> — контейнер использует сеть хоста напрямую.
              </li>
              <li>
                <b>none</b> — у контейнера вообще нет сети.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "ARG vs ENV — в чём разница?",
        answer: (
          <>
            <p>
              <b>ARG</b> — переменная только во время сборки Docker image.
            </p>

            <pre>
              <code>{`ARG VERSION=1.0
RUN echo $VERSION`}</code>
            </pre>

            <p>
              Передаётся через{" "}
              <code>docker build --build-arg VERSION=2.0 .</code>
            </p>

            <hr />

            <p>
              <b>ENV</b> — переменная сохраняется в контейнере и доступна
              приложению.
            </p>

            <pre>
              <code>ENV NODE_ENV=production</code>
            </pre>
          </>
        ),
      },

      {
        question: "Что такое Multistage и зачем AS builder?",
        answer: (
          <>
            <p>
              <b>Multistage build</b> — несколько этапов <code>FROM</code> в
              одном Dockerfile.
            </p>

            <ul>
              <li>Итоговый образ меньше.</li>
              <li>В runtime нет компиляторов и лишнего кэша.</li>
              <li>Безопаснее.</li>
            </ul>

            <p>
              <b>AS builder</b> — имя этапа, на который потом можно ссылаться.
            </p>

            <pre>
              <code>{`FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o app

FROM alpine
COPY --from=builder /app/app .
CMD ["./app"]`}</code>
            </pre>
          </>
        ),
      },

      {
        question: "ADD vs COPY — в чём разница?",
        answer: (
          <>
            <p>Оба копируют файлы в Docker image, но:</p>

            <ul>
              <li>
                <b>COPY</b> — просто копирует файлы и папки с хоста в образ.
                Рекомендуется почти всегда.
              </li>
              <li>
                <b>ADD</b> — умеет автоматически распаковывать архивы и
                скачивать файлы по URL.
              </li>
            </ul>

            <pre>
              <code>{`COPY app.py /app/                # просто копирует
ADD archive.tar.gz /app/          # распакует архив
ADD https://example.com/file.txt /app/`}</code>
            </pre>

            <p>
              <b>Правило:</b> если не нужна распаковка или скачивание —
              используй <code>COPY</code>.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "kubernetes",
    name: "Kubernetes",
    cards: [
      {
        question: "Основные компоненты Kubernetes?",
        answer: (
          <>
            <p>
              <b>Control Plane:</b>
            </p>

            <ul>
              <li>
                <b>kube-apiserver</b> — входная точка API.
              </li>
              <li>
                <b>etcd</b> — хранилище состояния кластера.
              </li>
              <li>
                <b>scheduler</b> — решает, на какой ноде запустить Pod.
              </li>
              <li>
                <b>controller-manager</b> — следит, чтобы желаемое состояние
                совпадало с реальным.
              </li>
            </ul>

            <p>
              <b>Worker Node:</b>
            </p>

            <ul>
              <li>
                <b>kubelet</b> — агент на ноде, управляющий Pod.
              </li>
              <li>
                <b>kube-proxy</b> — сетевые правила.
              </li>
              <li>
                <b>container runtime</b> — containerd или CRI-O, запускает
                контейнеры.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Stateful vs Stateless — в чём разница?",
        answer: (
          <>
            <p>
              <b>Stateless</b> — приложение не хранит состояние локально.
            </p>

            <ul>
              <li>Любой Pod может обработать любой запрос.</li>
              <li>Легко масштабировать.</li>
              <li>Обычно используется Deployment.</li>
              <li>Примеры: веб-сервер, API.</li>
            </ul>

            <hr />

            <p>
              <b>Stateful</b> — у каждого экземпляра есть своё постоянное
              состояние.
            </p>

            <ul>
              <li>Данные.</li>
              <li>Постоянный идентификатор.</li>
              <li>Обычно используется StatefulSet + PVC.</li>
              <li>Примеры: базы данных, Kafka.</li>
            </ul>
          </>
        ),
      },

      {
        question: "Какую функцию выполняет ReplicaSet?",
        answer: (
          <>
            <p>
              <b>ReplicaSet</b> следит, чтобы всегда работало нужное количество
              одинаковых Pod.
            </p>

            <ul>
              <li>Pod умер → создаёт новый.</li>
              <li>Pod слишком много → удаляет лишний.</li>
            </ul>

            <p>
              Обычно напрямую ReplicaSet не используют — им управляет{" "}
              <b>Deployment</b>.
            </p>
          </>
        ),
      },

      {
        question: "Что такое Deployment?",
        answer: (
          <>
            <p>
              <b>Deployment</b> — контроллер, который управляет ReplicaSet.
            </p>

            <p>Позволяет:</p>

            <ul>
              <li>держать нужное количество реплик;</li>
              <li>делать rolling update без даунтайма;</li>
              <li>
                откатываться через <code>kubectl rollout undo</code>.
              </li>
            </ul>

            <p>Это самый частый способ запускать приложения в Kubernetes.</p>
          </>
        ),
      },

      {
        question: "Какая роль у DaemonSet?",
        answer: (
          <>
            <p>
              <b>DaemonSet</b> гарантирует, что на каждой ноде или выбранных
              нодах работает Pod.
            </p>

            <p>Добавляется новая нода → Pod появляется автоматически.</p>

            <p>Используется для:</p>

            <ul>
              <li>логирования;</li>
              <li>мониторинга — node-exporter;</li>
              <li>сетевых плагинов.</li>
            </ul>
          </>
        ),
      },

      {
        question: "PV vs PVC — в чём разница и как устроено?",
        answer: (
          <>
            <ul>
              <li>
                <b>PV — PersistentVolume</b> — реальное хранилище, например
                диск.
              </li>
              <li>
                <b>PVC — PersistentVolumeClaim</b> — заявка на хранилище.
                Например: «дай мне 10 ГБ».
              </li>
            </ul>

            <p>
              Kubernetes находит подходящий PV и привязывает его к PVC.
            </p>

            <p>
              Pod монтирует PVC как обычную папку, поэтому приложению не нужно
              знать, где физически лежат данные.
            </p>
          </>
        ),
      },

      {
        question: "Что такое Kubernetes Probes?",
        answer: (
          <>
            <p>
              Это проверки здоровья Pod, которые выполняет <b>kubelet</b>.
            </p>

            <ul>
              <li>
                <b>Startup Probe</b> — проверяет, что приложение запустилось.
              </li>
              <li>
                <b>Readiness Probe</b> — готов ли Pod принимать трафик.
              </li>
              <li>
                <b>Liveness Probe</b> — жив ли процесс. Если проверка не
                проходит, контейнер перезапускают.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Что такое Service и какие типы есть?",
        answer: (
          <>
            <p>
              <b>Service</b> — стабильная точка доступа к Pod, потому что IP Pod
              могут меняться.
            </p>

            <ul>
              <li>
                <b>ClusterIP</b> — доступен внутри кластера.
              </li>
              <li>
                <b>NodePort</b> — открывает порт на каждой ноде.
              </li>
              <li>
                <b>LoadBalancer</b> — внешний балансировщик.
              </li>
              <li>
                <b>ExternalName</b> — DNS-алиас на внешний сервис.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Что такое Pod Affinity и Pod Anti-Affinity?",
        answer: (
          <>
            <p>
              <b>Affinity</b> и <b>Anti-Affinity</b> управляют размещением Pod
              относительно других Pod по их <code>labels</code>.
            </p>
            <ul>
              <li><b>podAffinity</b> — требует или предпочитает размещение рядом с определёнными Pod.</li>
              <li><b>podAntiAffinity</b> — требует или предпочитает разнести Pod относительно определённых Pod.</li>
            </ul>
            <p>
              <code>topologyKey</code> задаёт область, в которой действует правило,
              например <code>kubernetes.io/hostname</code> для разделения по нодам.
            </p>
          </>
        ),
      },

      {
        question: "requiredDuringSchedulingIgnoredDuringExecution vs preferredDuringSchedulingIgnoredDuringExecution",
        answer: (
          <>
            <ul>
              <li>
                <b>requiredDuringSchedulingIgnoredDuringExecution</b> — жёсткое
                требование. Если подходящей ноды нет, Pod останется
                <code>Pending</code>.
              </li>
              <li>
                <b>preferredDuringSchedulingIgnoredDuringExecution</b> —
                предпочтение. Scheduler постарается выполнить правило, но может
                выбрать другую ноду.
              </li>
            </ul>
            <p>
              <b>IgnoredDuringExecution</b> означает, что изменение условия после
              запуска не приводит автоматически к выселению уже работающего Pod.
            </p>
          </>
        ),
      },

      {
        question: "Как использовать podAntiAffinity для отказоустойчивости?",
        answer: (
          <>
            <p>
              Можно запретить размещение реплик одного приложения на одной ноде,
              чтобы отказ одной ноды не уронил все реплики.
            </p>
            <pre>
              <code>{`podAntiAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchLabels:
          app: api
      topologyKey: kubernetes.io/hostname`}</code>
            </pre>
          </>
        ),
      },

      {
        question: "Что такое taint и toleration и чем они отличаются?",
        answer: (
          <>
            <p>
              <b>Taint</b> задаётся на ноде и ограничивает размещение Pod.
              <b>Toleration</b> задаётся на Pod и разрешает ему переносить
              соответствующий taint.
            </p>
            <pre>
              <code>{`kubectl taint nodes node1 dedicated=database:NoSchedule`}</code>
            </pre>
            <p>
              Важно: <b>toleration сама по себе не заставляет Pod выбрать эту ноду</b>.
              Она только разрешает размещение. Для выбора обычно используют
              <code>nodeSelector</code> или affinity.
            </p>
          </>
        ),
      },

      {
        question: "Какие эффекты taint бывают: NoSchedule, PreferNoSchedule и NoExecute?",
        answer: (
          <>
            <ul>
              <li><b>NoSchedule</b> — новые Pod без toleration не будут запланированы на ноде.</li>
              <li><b>PreferNoSchedule</b> — scheduler старается не размещать Pod на ноде, но это не жёсткий запрет.</li>
              <li><b>NoExecute</b> — влияет на новые Pod и может удалить уже работающие Pod без подходящей toleration.</li>
            </ul>
            <p>
              Для <code>NoExecute</code> можно использовать
              <code>tolerationSeconds</code>, чтобы Pod оставался на ноде
              ограниченное время после появления taint.
            </p>
          </>
        ),
      },

      {
        question: "Как совместить taints/tolerations и node affinity?",
        answer: (
          <>
            <ul>
              <li><b>Taint</b> — не пускает сюда обычные Pod.</li>
              <li><b>Toleration</b> — разрешает конкретному Pod пройти это ограничение.</li>
              <li><b>Node affinity</b> — говорит, где Pod нужно или желательно разместить.</li>
            </ul>
            <p>
              Например, для выделенных database-нoд можно использовать
              <code>dedicated=database:NoSchedule</code> + toleration у database Pod
              + node affinity по label <code>dedicated=database</code>.
            </p>
          </>
        ),
      },

      {
        question: "Что такое HPA и что именно он масштабирует?",
        answer: (
          <>
            <p>
              <b>HPA (Horizontal Pod Autoscaler)</b> автоматически изменяет
              количество реплик workload, например Deployment, на основании метрик.
            </p>
            <p>
              HPA масштабирует <b>количество Pod</b>, а не размер ноды.
              Минимум и максимум задаются через <code>minReplicas</code> и
              <code>maxReplicas</code>.
            </p>
          </>
        ),
      },

      {
        question: "Как HPA использует CPU/memory и почему важны requests?",
        answer: (
          <>
            <p>
              При использовании resource metrics HPA сравнивает фактическое
              потребление с заданными <code>requests</code>.
            </p>
            <pre>
              <code>{`resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi`}</code>
            </pre>
            <p>
              Поэтому корректные requests важны не только для scheduler, но и
              для расчёта utilization HPA. Для стандартных CPU/memory metrics
              обычно используется Metrics Server.
            </p>
          </>
        ),
      },

      {
        question: "Как настроить HPA через autoscaling/v2?",
        answer: (
          <>
            <pre>
              <code>{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`}</code>
            </pre>
            <ul>
              <li><b>minReplicas</b> — минимальное количество Pod.</li>
              <li><b>maxReplicas</b> — максимальное количество Pod.</li>
              <li><b>averageUtilization</b> — целевая средняя загрузка CPU относительно requests.</li>
            </ul>
          </>
        ),
      },

      {
        question: "Какие метрики кроме CPU можно использовать в HPA?",
        answer: (
          <>
            <p>
              В <code>autoscaling/v2</code> доступны разные источники:
            </p>
            <ul>
              <li><b>Resource</b> — CPU и memory.</li>
              <li><b>Pods</b> — метрика на Pod.</li>
              <li><b>Object</b> — метрика Kubernetes-объекта.</li>
              <li><b>External</b> — внешняя метрика.</li>
            </ul>
            <p>
              Для пользовательских и внешних метрик требуется соответствующая
              инфраструктура metrics API/adapter.
            </p>
          </>
        ),
      },

      {
        question: "Почему HPA может не масштабировать Deployment?",
        answer: (
          <>
            <ul>
              <li>нет доступных metrics;</li>
              <li>не заданы подходящие CPU/memory requests;</li>
              <li>достигнут <code>maxReplicas</code>;</li>
              <li>нагрузка не превышает target;</li>
              <li>есть проблемы с Metrics Server или metrics API.</li>
            </ul>
            <pre>
              <code>{`kubectl get hpa
kubectl describe hpa <name>
kubectl top pods
kubectl top nodes`}</code>
            </pre>
          </>
        ),
      },

    ],

  },


  {
    id: "linux",
    name: "Linux",
    cards: [
      {
        question: "Диск показывает 100%, но du не показывает, куда делось место. Что проверять?",
        answer: (
          <>
            <p>
              В первую очередь я проверю не только размер файлов, но и <b>inode</b>.
            </p>

            <p>
              Если закончились inode, файловая система может перестать создавать
              новые файлы даже при наличии свободного места в гигабайтах.
            </p>

            <p>Поэтому проверяю:</p>

            <pre>
              <code>{`df -h
df -i`}</code>
            </pre>

            <p>
              <code>df -h</code> показывает использование дискового пространства,
              а <code>df -i</code> — использование inode.
            </p>
          </>
        ),
      },

      {
        question: "Что такое inode и почему они могут закончиться?",
        answer: (
          <>
            <p>
              <b>inode</b> — структура файловой системы, в которой хранится
              информация о файле: права, владелец, размер, timestamps и ссылки
              на блоки с данными.
            </p>

            <p>
              Каждый файл и каталог использует inode. Поэтому огромное количество
              маленьких файлов может закончить inode раньше, чем закончится
              само дисковое пространство.
            </p>

            <p>
              Например, миллионы маленьких временных файлов могут привести
              к ситуации: <b>диск по GB ещё не заполнен, но новые файлы создать нельзя</b>.
            </p>
          </>
        ),
      },

      {
        question: "Почему du может не показывать файлы, которые занимают место?",
        answer: (
          <>
            <p>
              Один из важных случаев — файл был удалён, но какой-то процесс
              продолжает держать его открытым.
            </p>

            <p>
              Тогда файл уже не виден через обычный <code>du</code>,
              но его данные физически продолжают занимать место,
              пока процесс не закроет файловый дескриптор.
            </p>

            <p>
              Поэтому при такой проблеме я проверю открытые deleted-файлы,
              например через <code>lsof</code>.
            </p>
          </>
        ),
      },

      {
        question: "Что такое Load Average в Linux?",
        answer: (
          <>
            <p>
              <b>Load average</b> показывает среднее количество задач,
              которые находятся в состоянии runnable или ожидают завершения
              некоторых операций, включая I/O.
            </p>

            <p>
              Поэтому load average — это <b>не просто загрузка CPU</b>.
              Высокий load может быть связан не только с CPU,
              но и с ожиданием диска.
            </p>

            <p>
              Например, CPU может быть загружен всего на 30%, но если процессы
              массово ждут медленный диск, load average может быть высоким.
            </p>
          </>
        ),
      },

      {
        question: "Что такое I/O wait и как он связан с Load Average?",
        answer: (
          <>
            <p>
              <b>I/O wait</b> — время, когда CPU простаивает, потому что процессы
              ждут завершения операций ввода-вывода, например чтения с диска.
            </p>

            <p>
              Поэтому при высоком load average я не буду автоматически говорить
              «не хватает CPU». Сначала посмотрю, не связано ли это с I/O.
            </p>

            <p>
              Например, можно посмотреть CPU и I/O через <code>top</code>,
              <code>vmstat</code> или специализированные инструменты мониторинга.
            </p>
          </>
        ),
      },

      {
        question: "Что такое hard link в Linux?",
        answer: (
          <>
            <p>
              <b>Hard link</b> — это ещё одно имя, которое указывает на тот же
              inode и те же данные файла.
            </p>

            <p>
              Поэтому у одного файла может быть несколько имён.
              Удаление одного имени не удаляет данные, пока остаётся хотя бы
              одна hard link.
            </p>

            <p>
              Важный момент: размер данных не дублируется при создании hard link —
              обе ссылки указывают на одни и те же данные.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "monitoring",
    name: "Мониторинг",
    cards: [
      {
        question: "Как понять, почему сервер начал тормозить?",
        answer: (
          <>
            <p>
              Я бы сначала разделил проблему на CPU, memory, disk I/O и network.
            </p>

            <ul>
              <li><b>CPU</b> — смотрю utilization, load average и процессы.</li>
              <li><b>Memory</b> — usage, available memory, swap и OOM.</li>
              <li><b>Disk</b> — свободное место, inode и I/O wait.</li>
              <li><b>Network</b> — traffic, errors, drops и latency.</li>
            </ul>

            <p>
              После этого уже ищу конкретный процесс или сервис,
              который создаёт нагрузку.
            </p>
          </>
        ),
      },

      {
        question: "Чем CPU utilization отличается от Load Average?",
        answer: (
          <>
            <p>
              <b>CPU utilization</b> показывает, насколько занят процессор.
            </p>

            <p>
              <b>Load Average</b> показывает количество задач, которые готовы
              выполняться или находятся в состоянии ожидания, в том числе
              из-за I/O.
            </p>

            <p>
              Поэтому высокий load average не всегда означает,
              что CPU полностью загружен.
            </p>
          </>
        ),
      },

      {
        question: "Что проверять, если на сервере закончился диск?",
        answer: (
          <>
            <p>Я бы проверял проблему в несколько этапов:</p>

            <ol>
              <li>Свободное место через <code>df -h</code>.</li>
              <li>Inode через <code>df -i</code>.</li>
              <li>Какие директории самые большие — через <code>du</code>.</li>
              <li>Открытые удалённые файлы — через <code>lsof</code>.</li>
              <li>Логи, временные файлы и другие источники роста.</li>
            </ol>

            <p>
              То есть я сначала определяю: <b>закончились блоки, inode или место
              удерживается удалёнными файлами</b>.
            </p>
          </>
        ),
      },

      {
        question: "Что такое OOM и как его диагностировать?",
        answer: (
          <>
            <p>
              <b>OOM (Out Of Memory)</b> происходит, когда системе не хватает
              доступной памяти и Linux OOM killer выбирает процесс для завершения.
            </p>

            <p>
              При диагностике я проверю потребление памяти, swap и системные
              сообщения, чтобы понять, какой процесс был завершён.
            </p>

            <p>
              В Kubernetes похожая ситуация может проявляться как
              <b>OOMKilled</b>, когда контейнер превышает установленный
              memory limit.
            </p>
          </>
        ),
      },

      {
        question: "Что такое Golden Signals?",
        answer: (
          <>
            <p>Четыре основных сигнала для мониторинга сервиса:</p>

            <ul>
              <li><b>Latency</b> — сколько времени занимает запрос.</li>
              <li><b>Traffic</b> — сколько запросов получает система.</li>
              <li><b>Errors</b> — сколько запросов завершается ошибкой.</li>
              <li><b>Saturation</b> — насколько система близка к пределу своих ресурсов.</li>
            </ul>

            <p>
              Они помогают смотреть не только на состояние серверов,
              но и на реальное состояние сервиса для пользователя.
            </p>
          </>
        ),
      },

      {
        question: "Что такое RED method?",
        answer: (
          <>
            <p>RED — подход для мониторинга сервисов:</p>

            <ul>
              <li><b>Rate</b> — количество запросов.</li>
              <li><b>Errors</b> — количество или доля ошибок.</li>
              <li><b>Duration</b> — время обработки запросов.</li>
            </ul>

            <p>
              Например, для API я бы в первую очередь смотрел
              request rate, error rate и latency.
            </p>
          </>
        ),
      },

      {
        question: "Чем мониторинг инфраструктуры отличается от мониторинга приложения?",
        answer: (
          <>
            <p>
              <b>Infrastructure monitoring</b> показывает состояние ресурсов:
              CPU, memory, disk, network, nodes и т.д.
            </p>

            <p>
              <b>Application monitoring</b> показывает состояние самого приложения:
              latency, количество запросов, ошибки, throughput и бизнес-метрики.
            </p>

            <p>
              Хороший мониторинг связывает оба уровня:
              например, рост latency приложения можно сопоставить
              с высоким I/O wait или нехваткой CPU на нодах.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "helm",
    name: "Helm",
    cards: [
      {
        question: "Разница между Chart.yaml и values.yaml?",
        answer: (
          <>
            <ul>
              <li>
                <b>Chart.yaml</b> — метаданные Chart: имя, версия, описание,
                зависимости.
              </li>
              <li>
                <b>values.yaml</b> — значения по умолчанию: image, replicas,
                ports и другое.
              </li>
            </ul>

            <p>
              Значения из <code>values.yaml</code> можно переопределять при
              установке Chart.
            </p>
          </>
        ),
      },

      {
        question: "Что такое Helm Release?",
        answer: (
          <>
            <p>
              <b>Helm Release</b> — конкретный установленный экземпляр Chart в
              Kubernetes.
            </p>

            <ul>
              <li>имя;</li>
              <li>версия;</li>
              <li>история изменений.</li>
            </ul>

            <pre>
              <code>helm install my-app ./chart</code>
            </pre>

            <p>Создаёт Release с именем <code>my-app</code>.</p>
          </>
        ),
      },

      {
        question: "Разница между helm install и helm upgrade?",
        answer: (
          <>
            <ul>
              <li>
                <b>helm install</b> — устанавливает Chart впервые.
              </li>
              <li>
                <b>helm upgrade</b> — обновляет существующий Release.
              </li>
            </ul>

            <p>
              <code>helm upgrade --install</code> обновит Release, а если его
              нет — установит.
            </p>
          </>
        ),
      },
    ],

  },

  {
    id: "prometheus",
    name: "Prometheus",
    cards: [
      {
        question: "Pull vs Push модель сбора метрик?",
        answer: (
          <>
            <ul>
              <li>
                <b>Pull</b> — Prometheus сам приходит к приложению и забирает
                метрики с <code>/metrics</code>.
              </li>
              <li>
                <b>Push</b> — приложение само отправляет метрики в систему.
              </li>
            </ul>

            <p>
              Pull проще контролировать и масштабировать в Kubernetes.
            </p>
          </>
        ),
      },

      {
        question: "Разница между rate(), irate() и increase()?",
        answer: (
          <>
            <p>Все три функции обычно работают с Counter.</p>

            <ul>
              <li>
                <code>rate()</code> — средняя скорость увеличения в секунду за
                период.
              </li>
              <li>
                <code>irate()</code> — скорость по последним двум точкам,
                поэтому более шумная.
              </li>
              <li>
                <code>increase()</code> — абсолютное увеличение Counter за
                период.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Основные типы метрик в Prometheus?",
        answer: (
          <>
            <ul>
              <li>
                <b>Counter</b> — только растёт. Например: количество запросов и
                ошибок.
              </li>
              <li>
                <b>Gauge</b> — может расти и падать. Например: память или
                количество Pod.
              </li>
              <li>
                <b>Histogram</b> — распределение значений по bucket.
              </li>
              <li>
                <b>Summary</b> — квантили считаются на стороне приложения.
              </li>
            </ul>
          </>
        ),
      },
    ],
  },

  {
    id: "git",
    name: "Git",
    cards: [
      {
        question: "Что делает git clone?",
        answer: (
          <>
            <p>
              <code>git clone</code> копирует удалённый Git-репозиторий на
              локальный компьютер.
            </p>

            <p>
              Копируются файлы проекта и история коммитов.
            </p>

            <pre>
              <code>
                git clone https://github.com/user/project.git
              </code>
            </pre>

            <p>После этого у тебя появляется локальная копия проекта.</p>
          </>
        ),
      },

      {
        question: "Что делает git push?",
        answer: (
          <>
            <p>
              <code>git push</code> отправляет локальные коммиты в удалённый
              репозиторий.
            </p>

            <pre>
              <code>git push origin main</code>
            </pre>

            <ul>
              <li>
                <b>origin</b> — удалённый репозиторий.
              </li>
              <li>
                <b>main</b> — ветка, в которую отправляются изменения.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Что делает git pull?",
        answer: (
          <>
            <p>
              <code>git pull</code> получает изменения из удалённого репозитория
              и объединяет их с текущей локальной веткой.
            </p>

            <pre>
              <code>git pull origin main</code>
            </pre>

            <p>Упрощённо:</p>

            <pre>
              <code>{`git fetch
git merge`}</code>
            </pre>

            <p>
              То есть <code>git pull</code> обычно = скачать изменения +
              объединить.
            </p>
          </>
        ),
      },

      {
        question: "Что такое origin в Git?",
        answer: (
          <>
            <p>
              <b>origin</b> — стандартное имя удалённого репозитория.
            </p>

            <p>
              Обычно оно автоматически создаётся после <code>git clone</code>.
            </p>

            <pre>
              <code>git remote -v</code>
            </pre>

            <p>
              Показывает список удалённых репозиториев.
            </p>

            <pre>
              <code>git push origin main</code>
            </pre>

            <p>
              Здесь <b>origin</b> — куда отправляем изменения, а <b>main</b> —
              какую ветку отправляем.
            </p>
          </>
        ),
      },

      {
        question: "Что такое HEAD в Git?",
        answer: (
          <>
            <p>
              <b>HEAD</b> — указатель на текущую позицию в Git.
            </p>

            <p>
              Обычно HEAD указывает на текущую ветку, а ветка — на последний
              коммит:
            </p>

            <pre>
              <code>{`HEAD → main → последний commit`}</code>
            </pre>

            <p>
              Если переключиться на конкретный коммит, HEAD может указывать
              напрямую на него. Это называется <b>detached HEAD</b>.
            </p>
          </>
        ),
      },

      {
        question: "Что такое hash коммита?",
        answer: (
          <>
            <p>
              <b>Hash</b> — уникальный идентификатор конкретного коммита.
            </p>

            <pre>
              <code>a1b2c3d4e5f6...</code>
            </pre>

            <p>
              По hash можно обратиться к конкретному коммиту:
            </p>

            <pre>
              <code>git show a1b2c3d</code>
            </pre>

            <p>
              <b>HEAD</b> — указатель на текущую позицию.
              <br />
              <b>Hash</b> — идентификатор конкретного коммита.
            </p>
          </>
        ),
      },

      {
        question: "В чём разница между git fetch и git pull?",
        answer: (
          <>
            <p>
              <code>git fetch</code> скачивает информацию и изменения из
              удалённого репозитория, но не объединяет их автоматически с твоей
              текущей веткой.
            </p>

            <hr />

            <p>
              <code>git pull</code> скачивает изменения и сразу объединяет их с
              текущей веткой.
            </p>

            <p>
              Упрощённо:
            </p>

            <ul>
              <li>
                <code>git fetch</code> = скачать.
              </li>
              <li>
                <code>git pull</code> = скачать + объединить.
              </li>
            </ul>
          </>
        ),
      },

      {
        question: "Что делает git add?",
        answer: (
          <>
            <p>
              <code>git add</code> добавляет изменения в <b>staging area</b> —
              область подготовки перед коммитом.
            </p>

            <pre>
              <code>git add .</code>
            </pre>

            <p>Добавляет все изменённые файлы для следующего коммита.</p>

            <p>После этого обычно выполняют:</p>

            <pre>
              <code>git commit -m "Описание изменений"</code>
            </pre>
          </>
        ),
      },

      {
        question: "Что делает git commit?",
        answer: (
          <>
            <p>
              <code>git commit</code> сохраняет подготовленные изменения в
              локальную историю Git.
            </p>

            <pre>
              <code>git commit -m "Add Git questions"</code>
            </pre>

            <p>
              Коммит создаётся только локально. Чтобы отправить его на GitHub,
              нужен <code>git push</code>.
            </p>
          </>
        ),
      },

      {
        question: "Что показывает git status?",
        answer: (
          <>
            <p>
              <code>git status</code> показывает текущее состояние репозитория.
            </p>

            <ul>
              <li>какие файлы изменены;</li>
              <li>какие файлы добавлены в staging area;</li>
              <li>какие файлы ещё не отслеживаются;</li>
              <li>в какой ветке ты находишься.</li>
            </ul>
          </>
        ),
      },

      {
        question: "Как посмотреть историю коммитов?",
        answer: (
          <>
            <p>
              Для просмотра полной истории используется:
            </p>

            <pre>
              <code>git log</code>
            </pre>

            <p>
              Для короткого и удобного отображения:
            </p>

            <pre>
              <code>git log --oneline</code>
            </pre>

            <p>
              Покажет короткий hash и сообщение каждого коммита.
            </p>
          </>
        ),
      },
    ],
  },
];

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

function App() {
  const [activeSectionId, setActiveSectionId] = useState("docker");
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeSection = sections.find(
    (section) => section.id === activeSectionId
  );

  const cards = activeSection.cards;
  const currentCard = cards[flashIndex];

  const selectSection = (sectionId) => {
    setIsFlipped(false);
    setActiveSectionId(sectionId);
    setFlashIndex(0);
  };

  const nextCard = () => {
    setIsFlipped(false);

    setTimeout(() => {
      setFlashIndex((prev) =>
        prev === cards.length - 1 ? 0 : prev + 1
      );
    }, 250);
  };

  const previousCard = () => {
    setIsFlipped(false);

    setTimeout(() => {
      setFlashIndex((prev) =>
        prev === 0 ? cards.length - 1 : prev - 1
      );
    }, 250);
  };

  return (
    <div className="app">
      <main className="content">
        <section className="flash-section">
          <div className="section-navigation">
            {sections.map((section) => (
              <button
                key={section.id}
                className={
                  activeSectionId === section.id
                    ? "section-button active"
                    : "section-button"
                }
                onClick={() => selectSection(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>

          <div className="counter">
            {activeSection.name} · Вопрос {flashIndex + 1} из{" "}
            {cards.length}
          </div>

          <div
            className={`flash-card ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            <div className="flash-card-inner">
              <div className="flash-card-front">
                <span className="card-title">ВОПРОС</span>

                <h1>{currentCard.question}</h1>

                <p className="click-text">
                  Нажми на карточку, чтобы увидеть ответ
                </p>
              </div>

              <div className="flash-card-back">
                <span className="card-title">ОТВЕТ</span>

                <div className="answer-content">
                  {currentCard.answer}
                </div>
              </div>
            </div>
          </div>

          <div className="flash-controls">
            <button onClick={previousCard}>← Назад</button>
            <button onClick={nextCard}>Следующая →</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
