FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    vim \
    jq \
    bash-completion \
    ca-certificates \
    gnupg \
    lsb-release \
    less \
    tar \
    gzip \
    && rm -rf /var/lib/apt/lists/*

# kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
 && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
 && rm kubectl

# helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip \
 && unzip awscliv2.zip \
 && ./aws/install \
 && rm -rf aws awscliv2.zip

# terraform
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/hashicorp.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
    > /etc/apt/sources.list.d/hashicorp.list \
 && apt-get update \
 && apt-get install -y terraform

# kustomize
RUN curl -s https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh | bash \
 && mv kustomize /usr/local/bin/

# k9s
RUN curl -L https://github.com/derailed/k9s/releases/latest/download/k9s_Linux_amd64.tar.gz \
 | tar xz && mv k9s /usr/local/bin/

# kubectx + kubens
RUN git clone https://github.com/ahmetb/kubectx /opt/kubectx \
 && ln -s /opt/kubectx/kubectx /usr/local/bin/kubectx \
 && ln -s /opt/kubectx/kubens /usr/local/bin/kubens

# eksctl
RUN curl -sL https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_Linux_amd64.tar.gz \
 | tar xz -C /tmp \
 && mv /tmp/eksctl /usr/local/bin

# yq
RUN curl -L https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 \
 -o /usr/local/bin/yq \
 && chmod +x /usr/local/bin/yq

# Bash completions
RUN echo "source /usr/share/bash-completion/bash_completion" >> /root/.bashrc \
 && echo "source <(kubectl completion bash)" >> /root/.bashrc \
 && echo "source <(helm completion bash)" >> /root/.bashrc \
 && echo "source <(terraform -install-autocomplete)" >> /root/.bashrc

WORKDIR /workspace

RUN git config --global user.name "Ajesh Mishra" \
    && git config --global user.email "ajesh.sit@gmail.com"


CMD ["/bin/bash"]