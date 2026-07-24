#!/bin/sh

# Generates a CA and a certificate for use with squid
# After running the script, the CA will be in ${destDir}/rootCA.crt, clients
# will need it, but the squid container has no need for it
# The only file squid needs is ${destDir}/squid.pem
#
# The certificate is only valid for 127.0.0.1, localhost and 192.168.122.1
# If certificates for other hostnames/IPs are needed, modify the [alt_names]
# section
#
# The certificate used by squid can be overriden when starting the container:
# podman run -v ./pki/:/etc/pki/squid:z ...

set -euo pipefail

destDir=${1:-pki}
baseName=${2:-squid}

mkdir -p $destDir

cat >${destDir}/rootCA.cnf <<EOF
# default section for "req" command options
[req]
distinguished_name = rootca_dn
prompt = no

[rootca_dn]
# Minimum of 4 bytes are needed for common name
commonName = squid CA

# ISO2 country code only
countryName = FR

# City is required
localityName = Paris

[v3_ca]
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
basicConstraints = critical, CA:TRUE, pathlen:3
keyUsage = critical, cRLSign, keyCertSign
nsCertType = sslCA, emailCA
EOF

# can most likely be done without config file, see EXAMPLES in man openssl-req:
# openssl req -new -subj "/C=GB/CN=foo" \
#                         -addext "subjectAltName = DNS:foo.co.uk" \
#                         -addext "certificatePolicies = 1.2.3.4" \
#                         -newkey rsa:2048 -keyout key.pem -out req.pem
openssl req -x509 -newkey rsa:4096 -nodes -keyout ${destDir}/rootCA.key -sha256 -days 2048 -out ${destDir}/rootCA.crt -config ${destDir}/rootCA.cnf -extensions v3_ca

cat >${destDir}/${baseName}.cnf <<EOF
# default section for "req" command options
[req]
distinguished_name = cert_dn
prompt = no

[cert_dn]
commonName = squid

# ISO2 country code only
countryName = FR

# City is required
localityName = Paris

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.0 = localhost
IP.0 = 127.0.0.1
# can be useful in nested virtualization setups
IP.1 = 192.168.122.1
EOF

openssl req -newkey rsa:4096 -nodes -keyout ${destDir}/${baseName}.key -out ${destDir}/${baseName}.csr -config ${destDir}/${baseName}.cnf -extensions v3_req #-addext "subjectAltName = IP:${commonName}"
openssl x509 -req -in ${destDir}/${baseName}.csr -CA ${destDir}/rootCA.crt -CAkey ${destDir}/rootCA.key -CAcreateserial -out ${destDir}/${baseName}.crt -days 1000 -sha256 -extensions v3_req -extfile ${destDir}/${baseName}.cnf

cat ${destDir}/${baseName}.crt ${destDir}/${baseName}.key >${destDir}/${baseName}.pem

echo "Successfully generated root CA and certificate"
echo ""
echo "Add 'https_port 3129 tls-cert=${destDir}/${baseName}.pem' to your squid configuration file"
echo ""
echo "The public CA certificate is ${destDir}/rootCA.crt"
echo "This can be used with curl with: curl  --proxy-cacert ${destDir}/rootCA.crt -L https://gandi.net"
