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
    ],

    quizQuestions: [
      {
        question: "Какой компонент Kubernetes хранит состояние кластера?",
        options: ["kubelet", "etcd", "kube-proxy"],
        correctAnswer: 1,
      },
      {
        question: "Какой объект обычно используют для запуска stateless-приложения?",
        options: ["Deployment", "StatefulSet", "PersistentVolume"],
        correctAnswer: 0,
      },
      {
        question: "Что делает Readiness Probe?",
        options: ["Перезапускает контейнер", "Проверяет, готов ли Pod принимать трафик", "Создаёт новый Pod"],
        correctAnswer: 1,
      },
      {
        question: "Какой Service доступен только внутри Kubernetes-кластера?",
        options: ["NodePort", "LoadBalancer", "ClusterIP"],
        correctAnswer: 2,
      },
      {
        question: "Для чего используется DaemonSet?",
        options: ["Запустить Pod на каждой выбранной ноде", "Создать постоянный диск", "Хранить секреты"],
        correctAnswer: 0,
      },
      {
        question: "Что делает ReplicaSet?",
        options: ["Хранит конфигурацию приложения", "Поддерживает нужное количество Pod", "Открывает внешний IP"],
        correctAnswer: 1,
      },
      {
        question: "Что такое PVC?",
        options: ["Заявка на persistent storage", "Сетевой балансировщик", "Контроллер Pod"],
        correctAnswer: 0,
      },
      {
        question: "Какая Probe отвечает за перезапуск контейнера при постоянном падении проверки?",
        options: ["Liveness Probe", "Readiness Probe", "Startup Probe"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Pod?",
        options: ["Минимальная deployable-единица Kubernetes", "Виртуальная машина", "Только сетевой объект"],
        correctAnswer: 0,
      },
      {
        question: "Что делает kubelet?",
        options: ["Управляет Pod на своей ноде", "Хранит состояние кластера", "Балансирует внешний трафик"],
        correctAnswer: 0,
      },
      {
        question: "Какую роль выполняет kube-apiserver?",
        options: ["Предоставляет API Kubernetes", "Запускает контейнеры напрямую", "Хранит Docker images"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен kube-scheduler?",
        options: ["Выбирает ноду для нового Pod", "Создаёт Service", "Собирает логи"],
        correctAnswer: 0,
      },
      {
        question: "Что делает controller-manager?",
        options: ["Следит за желаемым состоянием ресурсов", "Хранит образы", "Выдаёт IP Pod"],
        correctAnswer: 0,
      },
      {
        question: "Что такое StatefulSet?",
        options: ["Контроллер для stateful-приложений", "Сетевой балансировщик", "Система логирования"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Namespace?",
        options: ["Логическое разделение ресурсов кластера", "Отдельная физическая нода", "Тип container runtime"],
        correctAnswer: 0,
      },
      {
        question: "Что такое ConfigMap?",
        options: ["Хранилище обычной конфигурации", "Хранилище паролей с шифрованием", "Балансировщик нагрузки"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Secret?",
        options: ["Ресурс для хранения чувствительных данных", "Реплика Pod", "PersistentVolume"],
        correctAnswer: 0,
      },
      {
        question: "Что делает Service?",
        options: ["Даёт стабильную точку доступа к Pod", "Создаёт Docker image", "Запускает scheduler"],
        correctAnswer: 0,
      },
      {
        question: "Что делает NodePort?",
        options: ["Открывает Service через порт ноды", "Создаёт новую ноду", "Хранит состояние"],
        correctAnswer: 0,
      },
      {
        question: "Что делает LoadBalancer Service?",
        options: ["Предоставляет внешний load balancer, если его поддерживает окружение", "Удаляет Pod", "Монтирует PVC"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Ingress?",
        options: ["Правила HTTP/HTTPS-маршрутизации к сервисам", "Хранилище метрик", "Container runtime"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Ingress Controller?",
        options: ["Компонент, реализующий обработку Ingress", "Kubernetes database", "ReplicaSet"],
        correctAnswer: 0,
      },
      {
        question: "Что делает kubectl apply?",
        options: ["Применяет декларативную конфигурацию ресурса", "Удаляет namespace", "Собирает image"],
        correctAnswer: 0,
      },
      {
        question: "Что показывает kubectl get pods?",
        options: ["Список Pod и их состояние", "Логи контейнера", "Историю Git"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен kubectl describe?",
        options: ["Показывает подробную информацию о ресурсе и события", "Удаляет ресурс", "Создаёт image"],
        correctAnswer: 0,
      },
      {
        question: "Как посмотреть логи Pod?",
        options: ["kubectl logs", "kubectl events", "kubectl trace"],
        correctAnswer: 0,
      },
      {
        question: "Что такое labels?",
        options: ["Ключ-значение для идентификации и группировки объектов", "Пароли Kubernetes", "IP-адреса нод"],
        correctAnswer: 0,
      },
      {
        question: "Что такое selector?",
        options: ["Условие выбора объектов по labels", "DNS-сервер", "Тип volume"],
        correctAnswer: 0,
      },
      {
        question: "Как Service находит Pod?",
        options: ["Через selector и labels", "Через Dockerfile", "Через Git commit"],
        correctAnswer: 0,
      },
      {
        question: "Что такое requests CPU/memory?",
        options: ["Минимально запрашиваемые ресурсы для планирования", "Жёсткий максимальный лимит", "Размер Docker image"],
        correctAnswer: 0,
      },
      {
        question: "Что такое limits CPU/memory?",
        options: ["Ограничение потребления ресурсов контейнером", "Количество реплик", "Размер PVC"],
        correctAnswer: 0,
      },
      {
        question: "Что происходит при превышении memory limit?",
        options: ["Контейнер может быть завершён из-за OOMKilled", "Создаётся новый Service", "Pod автоматически становится StatefulSet"],
        correctAnswer: 0,
      },
      {
        question: "Что такое HPA?",
        options: ["Horizontal Pod Autoscaler", "Host Port Allocator", "Helm Pod Agent"],
        correctAnswer: 0,
      },
      {
        question: "Что масштабирует HPA?",
        options: ["Количество реплик workload", "Размер ноды", "Размер Docker image"],
        correctAnswer: 0,
      },
      {
        question: "Что такое PDB?",
        options: ["PodDisruptionBudget", "Pod Docker Backup", "Persistent Disk Block"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен PDB?",
        options: ["Ограничивать количество добровольно недоступных Pod при disruption", "Хранить секреты", "Маршрутизировать HTTP"],
        correctAnswer: 0,
      },
      {
        question: "Что такое taint у ноды?",
        options: ["Ограничение, препятствующее размещению Pod без соответствующей toleration", "Метка Service", "Тип PVC"],
        correctAnswer: 0,
      },
      {
        question: "Что такое toleration?",
        options: ["Разрешение Pod размещаться на ноде с соответствующим taint", "Ограничение CPU", "Тип Ingress"],
        correctAnswer: 0,
      },
      {
        question: "Что такое nodeSelector?",
        options: ["Простой способ выбрать ноды по labels", "Выбор Pod по IP", "Выбор Service по порту"],
        correctAnswer: 0,
      },
      {
        question: "Что такое affinity/anti-affinity?",
        options: ["Правила предпочтения или ограничения размещения Pod", "Настройка DNS", "Настройка storage"],
        correctAnswer: 0,
      },
      {
        question: "Что такое rolling update?",
        options: ["Постепенная замена старой версии Pod новой", "Одновременное удаление всех Pod", "Обновление только etcd"],
        correctAnswer: 0,
      },
      {
        question: "Как откатить Deployment?",
        options: ["kubectl rollout undo deployment/<name>", "kubectl rollback pod/<name>", "kubectl git revert deployment/<name>"],
        correctAnswer: 0,
      },
      {
        question: "Что показывает kubectl rollout status?",
        options: ["Статус rollout workload", "Статус Docker daemon", "Состояние Git branch"],
        correctAnswer: 0,
      },
      {
        question: "Что такое CrashLoopBackOff?",
        options: ["Контейнер падает и Kubernetes увеличивает интервалы между перезапусками", "Нода выключена навсегда", "Service удалён"],
        correctAnswer: 0,
      },
      {
        question: "Что означает Pending у Pod?",
        options: ["Pod ещё не запущен на ноде, например из-за проблем с scheduling", "Контейнер успешно завершён", "Pod обязательно сломан"],
        correctAnswer: 0,
      },
      {
        question: "Что означает ImagePullBackOff?",
        options: ["Kubernetes не может получить image и повторяет попытки с backoff", "PVC заполнен", "Ingress не найден"],
        correctAnswer: 0,
      },
      {
        question: "Что такое CNI?",
        options: ["Интерфейс/плагины сетевого взаимодействия контейнеров", "Система хранения секретов", "Контроллер реплик"],
        correctAnswer: 0,
      },
      {
        question: "Что такое CSI?",
        options: ["Интерфейс для storage plugins", "Интерфейс HTTP", "Система CI/CD"],
        correctAnswer: 0,
      },
      {
        question: "Зачем нужен PersistentVolume?",
        options: ["Предоставляет persistent storage ресурсам Kubernetes", "Балансирует трафик", "Запускает scheduler"],
        correctAnswer: 0,
      },
      {
        question: "Что такое StorageClass?",
        options: ["Описывает класс/способ динамического предоставления storage", "Тип Service", "Тип Pod"],
        correctAnswer: 0,
      },
      {
        question: "Что происходит при удалении Pod, созданного Deployment?",
        options: ["Deployment/ReplicaSet создаёт замену, если реплик стало меньше желаемого", "Кластер всегда останавливается", "PVC удаляется автоматически"],
        correctAnswer: 0,
      },
      {
        question: "Какой объект задаёт желаемое состояние количества реплик приложения?",
        options: ["Deployment", "Service", "ConfigMap"],
        correctAnswer: 0,
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

    quizQuestions: [
      {
        question: "За что отвечает Chart.yaml?",
        options: ["За значения конфигурации приложения", "За метаданные Helm Chart", "За состояние Pod"],
        correctAnswer: 1,
      },
      {
        question: "Где обычно хранятся значения по умолчанию для Helm Chart?",
        options: ["values.yaml", "Chart.lock", "templates.yaml"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Helm Release?",
        options: ["Конкретный установленный экземпляр Chart", "Docker image", "Kubernetes Node"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm install?",
        options: ["Удаляет Release", "Устанавливает Chart", "Только проверяет шаблоны"],
        correctAnswer: 1,
      },
      {
        question: "Что делает helm upgrade?",
        options: ["Обновляет существующий Release", "Создаёт новую Kubernetes-ноду", "Удаляет values.yaml"],
        correctAnswer: 0,
      },
      {
        question: "Что произойдёт при использовании helm upgrade --install?",
        options: ["Всегда будет удалён старый Release", "Release обновится, а если его нет — будет установлен", "Будет создан только values.yaml"],
        correctAnswer: 1,
      },
      {
        question: "Каким файлом обычно задают значения, которые передаются в шаблоны Helm?",
        options: ["values.yaml", "Chart.yaml", "README.md"],
        correctAnswer: 0,
      },
      {
        question: "Где находятся шаблоны Kubernetes-манифестов Helm?",
        options: ["templates/", "values/", "charts.yaml"],
        correctAnswer: 0,
      },
      {
        question: "Для чего используется _helpers.tpl?",
        options: ["Для переиспользуемых named templates", "Для хранения Secret", "Для запуска Helm"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm template?",
        options: ["Рендерит шаблоны локально в Kubernetes-манифесты", "Устанавливает Release в кластер", "Удаляет Chart"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm lint?",
        options: ["Проверяет Chart на проблемы", "Удаляет Release", "Публикует image"],
        correctAnswer: 0,
      },
      {
        question: "Что показывает helm list?",
        options: ["Установленные Releases", "Все Pod", "Все Docker images"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm uninstall?",
        options: ["Удаляет Release", "Удаляет Helm binary", "Удаляет Kubernetes namespace всегда"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен helm repo add?",
        options: ["Добавляет Helm repository", "Создаёт Release", "Создаёт namespace"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm repo update?",
        options: ["Обновляет локальную информацию о доступных Chart в репозиториях", "Обновляет Kubernetes", "Обновляет values.yaml"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Chart dependency?",
        options: ["Другой Chart, необходимый текущему Chart", "Docker container", "Kubernetes Node"],
        correctAnswer: 0,
      },
      {
        question: "Где можно описать зависимости Chart?",
        options: ["В Chart.yaml", "В README.md", "В Dockerfile"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Chart.lock?",
        options: ["Зафиксированные версии зависимостей Chart", "Состояние Pod", "Helm Secret"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm dependency update?",
        options: ["Обновляет зависимости Chart и lock-файл", "Обновляет Pod", "Удаляет зависимости"],
        correctAnswer: 0,
      },
      {
        question: "Как передать значение при helm install?",
        options: ["helm install app ./chart --set image.tag=1.2.3", "helm install app ./chart --env image.tag=1.2.3", "helm install app ./chart --value-only image.tag=1.2.3"],
        correctAnswer: 0,
      },
      {
        question: "Что имеет больший приоритет: --set или values.yaml?",
        options: ["--set", "values.yaml", "Chart.yaml всегда"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен .Values в шаблоне?",
        options: ["Для доступа к значениям Helm values", "Для доступа к etcd", "Для запуска kubectl"],
        correctAnswer: 0,
      },
      {
        question: "Для чего нужен .Release.Name?",
        options: ["Для получения имени текущего Release", "Для получения IP Pod", "Для получения версии Kubernetes"],
        correctAnswer: 0,
      },
      {
        question: "Что делает include в Helm?",
        options: ["Рендерит named template и возвращает результат", "Устанавливает Chart", "Удаляет namespace"],
        correctAnswer: 0,
      },
      {
        question: "Что делает tpl?",
        options: ["Позволяет отрендерить строку как Helm template", "Создаёт PVC", "Проверяет Git"],
        correctAnswer: 0,
      },
      {
        question: "Что такое Helm hook?",
        options: ["Ресурс/действие, запускаемое в определённый момент жизненного цикла Release", "Тип Kubernetes Service", "Docker volume"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm history?",
        options: ["Показывает историю ревизий Release", "Показывает историю Pod", "Показывает Git commits"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm rollback?",
        options: ["Откатывает Release к предыдущей ревизии", "Откатывает Kubernetes version", "Удаляет Chart"],
        correctAnswer: 0,
      },
      {
        question: "Что такое revision у Helm Release?",
        options: ["Номер ревизии Release", "Номер Pod", "Версия Docker"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm get values?",
        options: ["Показывает значения, использованные Release", "Показывает Pod logs", "Показывает Git diff"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm get manifest?",
        options: ["Показывает сгенерированные Kubernetes-манифесты Release", "Показывает Dockerfile", "Показывает values repository"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm show values?",
        options: ["Показывает values.yaml из Chart", "Показывает текущие Pod", "Показывает Release history"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm package?",
        options: ["Упаковывает Chart в архив", "Устанавливает Chart", "Удаляет Chart"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm pull?",
        options: ["Скачивает Chart из repository", "Запускает Pod", "Рендерит Deployment"],
        correctAnswer: 0,
      },
      {
        question: "Что делает helm search repo?",
        options: ["Ищет Chart в добавленных repositories", "Ищет Pod", "Ищет Secret"],
        correctAnswer: 0,
      },
      {
        question: "Зачем нужен .Chart в шаблонах?",
        options: ["Для доступа к информации текущего Chart", "Для доступа к Pod IP", "Для доступа к Git"],
        correctAnswer: 0,
      },
      {
        question: "Что такое NOTES.txt?",
        options: ["Файл с информацией, показываемой после установки/обновления Release", "Конфигурация Kubernetes API", "Lock-файл"],
        correctAnswer: 0,
      },
      {
        question: "Как проверить итоговые манифесты перед установкой?",
        options: ["helm template", "helm uninstall", "helm repo update"],
        correctAnswer: 0,
      },
      {
        question: "Что такое subchart?",
        options: ["Chart, используемый как зависимость другого Chart", "Отдельный Kubernetes master", "Тип Secret"],
        correctAnswer: 0,
      },
      {
        question: "Какой флаг helm install позволяет установить Chart с указанным namespace, создав его при необходимости?",
        options: ["--create-namespace", "--namespace-create", "--new-namespace"],
        correctAnswer: 0,
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

function App() {
  const [activeSectionId, setActiveSectionId] = useState("docker");
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Для Kubernetes и Helm можно переключаться между карточками и тестом.
  const [mode, setMode] = useState("flashcards");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const activeSection = sections.find(
    (section) => section.id === activeSectionId
  );

  const cards = activeSection.cards;
  const currentCard = cards[flashIndex];

  const isQuizAvailable = Boolean(activeSection.quizQuestions);

  const quizQuestions = activeSection.quizQuestions || [];
  const currentQuiz = quizQuestions[quizIndex];

  const selectSection = (sectionId) => {
    setIsFlipped(false);
    setActiveSectionId(sectionId);
    setFlashIndex(0);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setMode("flashcards");
  };

  const switchMode = (newMode) => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setQuizIndex(0);
    setMode(newMode);
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

  const answerQuiz = (answerIndex) => {
    // После первого ответа больше нельзя изменить выбор.
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
  };

  const nextQuizQuestion = () => {
    setSelectedAnswer(null);
    setQuizIndex((prev) =>
      prev === quizQuestions.length - 1 ? 0 : prev + 1
    );
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

          {isQuizAvailable && (
            <div className="mode-navigation">
              <button
                className={`mode-button ${
                  mode === "flashcards" ? "active" : ""
                }`}
                onClick={() => switchMode("flashcards")}
              >
                📚 Карточки
              </button>

              <button
                className={`mode-button ${
                  mode === "quiz" ? "active" : ""
                }`}
                onClick={() => switchMode("quiz")}
              >
                🧪 Тест
              </button>
            </div>
          )}

          {mode === "quiz" && isQuizAvailable ? (
            <>
              <div className="counter">
                {activeSection.name} · Тест · Вопрос {quizIndex + 1} из{" "}
                {quizQuestions.length}
              </div>

              <div className="quiz-card">
                <span className="card-title">ВОПРОС</span>

                <h1>{currentQuiz.question}</h1>

                <div className="quiz-options">
                  {currentQuiz.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuiz.correctAnswer;

                    let className = "quiz-option";

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        className += " correct";
                      } else if (isSelected) {
                        className += " wrong";
                      }
                    }

                    return (
                      <button
                        key={option}
                        className={className}
                        onClick={() => answerQuiz(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="option-number">
                          {index + 1}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div
                    className={
                      selectedAnswer === currentQuiz.correctAnswer
                        ? "quiz-result correct-result"
                        : "quiz-result wrong-result"
                    }
                  >
                    {selectedAnswer === currentQuiz.correctAnswer
                      ? "✓ Правильно"
                      : `✕ Неправильно. Правильный ответ: ${
                          currentQuiz.options[currentQuiz.correctAnswer]
                        }`}
                  </div>
                )}
              </div>

              <div className="flash-controls">
                <button
                  onClick={nextQuizQuestion}
                  disabled={selectedAnswer === null}
                >
                  Следующий вопрос →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="counter">
                {activeSection.name} · Вопрос {flashIndex + 1} из{" "}
                {cards.length}
              </div>

              <div
                className={`flash-card ${
                  isFlipped ? "flipped" : ""
                }`}
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}
export default App;
