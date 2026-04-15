# 🔧 Resolver "Missing required DKIM record" no Arsys

Este guia é específico para resolver o erro **"Domain Verification: Missing required DKIM record"** quando se usa o Arsys como provedor DNS.

## 🎯 O Problema

O Resend está a dizer que falta um registo DKIM, mesmo depois de ter adicionado os registos no Arsys. Isto geralmente acontece porque:

1. O nome do registo está incorreto (domínio duplicado)
2. Faltam alguns registos DKIM (o Resend geralmente pede 2-3)
3. O tipo de registo está errado (CNAME vs TXT)

## ✅ Solução Passo a Passo

### **PASSO 1: Verificar o que o Resend Precisa**

1. Acesse [https://resend.com/domains](https://resend.com/domains)
2. Clique no domínio `golisbontours.pt`
3. Vá à secção **"DNS Records"** ou **"Setup Instructions"**
4. **IMPORTANTE:** Anote **TODOS** os registos DKIM que aparecem
   - Quantos são? (geralmente 2-3)
   - Qual é o **tipo** de cada um? (CNAME ou TXT)
   - Qual é o **nome** exato de cada um?
   - Qual é o **valor** exato de cada um?

**Exemplo do que pode aparecer:**
```
Registo 1:
Tipo: CNAME
Nome: default._domainkey.golisbontours.pt
Valor: dkim.resend.com

Registo 2:
Tipo: TXT
Nome: resend._domainkey.golisbontours.pt
Valor: (uma string muito longa)
```

### **PASSO 2: Verificar os Registos Atuais no Arsys**

1. Acesse o painel do Arsys: [https://pdc.arsys.es](https://pdc.arsys.es)
2. Vá a **"Domínios"** → **"golisbontours.pt"** → **"Zona DNS"**
3. Liste **TODOS** os registos DNS existentes
4. Procure por registos que contenham `_domainkey` no nome

**O que verificar:**
- ✅ Quantos registos DKIM existem? (devem ser 2-3, igual ao que o Resend pede)
- ❌ Algum registo tem o domínio duplicado? (ex: `default._domainkey.golisbontours.pt.golisbontours.pt`)
- ✅ Os nomes estão corretos? (devem ser `default._domainkey.golisbontours.pt` ou similar, mas **NÃO** duplicado)

### **PASSO 3: Corrigir ou Adicionar os Registos DKIM**

Para cada registo DKIM que o Resend pede:

#### **Se o registo NÃO existe no Arsys:**

1. Clique em **"Adicionar Registro"** ou **"Nuevo Registro"**
2. **Tipo:** Selecione o tipo que o Resend indica (CNAME ou TXT)
3. **Nome/Host:** 
   - O Resend mostra: `default._domainkey.golisbontours.pt`
   - No Arsys, digite **APENAS:** `default._domainkey`
   - **NÃO** digite o `.golisbontours.pt` - o Arsys adiciona automaticamente!
4. **Valor/Conteúdo:** Cole **EXATAMENTE** o valor que o Resend forneceu
   - Se for CNAME: `dkim.resend.com`
   - Se for TXT: a string longa (copie tudo, sem espaços extras)
5. **TTL:** Deixe o padrão (3600)
6. Clique em **"Guardar"** ou **"Aceptar"**

#### **Se o registo JÁ existe mas está ERRADO:**

1. **Identifique o problema:**
   - Nome duplicado? (ex: `default._domainkey.golisbontours.pt.golisbontours.pt`)
   - Valor incorreto?
   - Tipo errado?

2. **Apague o registo errado:**
   - Clique nos três pontos (⋯) ou no ícone de editar
   - Selecione **"Eliminar"** ou **"Borrar"**
   - Confirme a eliminação

3. **Crie o registo novamente** seguindo as instruções acima

### **PASSO 4: Verificar se os Registos Estão Corretos**

Depois de adicionar/corrigir todos os registos:

1. **No Arsys:**
   - Verifique se todos os registos DKIM aparecem na lista
   - Verifique se os nomes estão corretos (sem duplicação do domínio)
   - Verifique se os valores estão corretos

2. **Usando DNS Checker (após 15-30 minutos):**
   - Acesse [https://dnschecker.org](https://dnschecker.org)
   - Para cada registo DKIM, digite o nome completo (ex: `default._domainkey.golisbontours.pt`)
   - Selecione o tipo (CNAME ou TXT)
   - Clique em "Search"
   - Verifique se o registo aparece e se o valor está correto

**Exemplo:**
- Digite: `default._domainkey.golisbontours.pt`
- Tipo: CNAME
- Deve mostrar: `dkim.resend.com`

### **PASSO 5: Verificar no Resend**

1. Aguarde 15-30 minutos após adicionar/corrigir os registos
2. Vá ao Resend: [https://resend.com/domains](https://resend.com/domains)
3. Clique no domínio `golisbontours.pt`
4. Clique em **"Verify"** ou **"Check Status"**
5. O Resend vai verificar automaticamente

**Se ainda falhar:**
- Verifique novamente os registos no DNS Checker
- Certifique-se de que adicionou **TODOS** os registos DKIM que o Resend pede
- Verifique se não há erros de digitação nos nomes ou valores

## 🔍 Checklist de Verificação

Antes de verificar no Resend, certifique-se de que:

- [ ] Adicionei **TODOS** os registos DKIM que o Resend pede (geralmente 2-3)
- [ ] Cada registo tem o **tipo correto** (CNAME ou TXT, conforme o Resend indica)
- [ ] Cada registo tem o **nome correto** (sem duplicação do domínio)
- [ ] Cada registo tem o **valor correto** (copiado exatamente do Resend)
- [ ] Aguardei pelo menos 15-30 minutos após adicionar os registos
- [ ] Verifiquei no DNS Checker que os registos estão propagados
- [ ] Não há registos duplicados ou incorretos no Arsys

## 🚨 Problemas Comuns e Soluções

### **Problema 1: "Não sei se devo inserir o domínio completo ou apenas o subdomínio"**

**Solução:**
- No Arsys, **SEMPRE** insira apenas o subdomínio (ex: `default._domainkey`)
- O Arsys adiciona automaticamente o `.golisbontours.pt`
- Se inserir `default._domainkey.golisbontours.pt`, vai resultar em `default._domainkey.golisbontours.pt.golisbontours.pt` (errado!)

### **Problema 2: "Adicionei mas o DNS Checker não mostra"**

**Solução:**
- Aguarde mais tempo (pode levar até 1 hora para propagar)
- Verifique se guardou o registo corretamente no Arsys
- Verifique se não há erros de digitação

### **Problema 3: "O Resend pede CNAME mas só vejo TXT no Arsys"**

**Solução:**
- O Arsys suporta CNAME - procure melhor na lista de tipos de registo
- Se realmente não tiver CNAME, contacte o suporte do Arsys
- Mas geralmente o Arsys tem CNAME - verifique novamente

### **Problema 4: "Já tentei tudo mas ainda não funciona"**

**Solução:**
1. Apague **TODOS** os registos DKIM existentes no Arsys
2. Aguarde 15 minutos
3. Adicione novamente **TODOS** os registos DKIM, um de cada vez, seguindo as instruções acima
4. Aguarde 30 minutos
5. Verifique no DNS Checker
6. Verifique no Resend

## 📞 Ainda com Problemas?

Se após seguir todos estes passos o problema persistir:

1. **Contacte o suporte do Arsys:**
   - Explique que precisa de adicionar registos DKIM para verificação de domínio
   - Peça ajuda para adicionar registos CNAME ou TXT
   - Pode ser que o painel do Arsys tenha alguma particularidade

2. **Verifique os logs do Resend:**
   - No dashboard do Resend, vá a "Logs"
   - Veja se há mensagens de erro específicas sobre os registos DNS

3. **Use ferramentas de diagnóstico:**
   - [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
   - [DNS Checker](https://dnschecker.org)
   - [Google Admin Toolbox](https://toolbox.googleapps.com/apps/checkmx/check)

---

**Última atualização:** Janeiro 2026

