import boto3
import os
import json
import base64

def get_secret(secret_name):
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId=secret_name)
    return response["SecretString"]

origin_cert_dict = json.loads(get_secret("OriginCertSecrets"))
# Decode from base64 (used to prevent newline drops in secret storage)
ssl_cert = base64.b64decode(origin_cert_dict["origin-ca-cert"]).decode("utf-8")
ssl_key = base64.b64decode(origin_cert_dict["origin-ca-key"]).decode("utf-8")

# Store them temporarily in a secure file if needed
with open("/etc/ssl/certs/origin_ca_cert.pem", "w") as cert_file:
    cert_file.write(ssl_cert)
with open("/etc/ssl/private/origin_ca_key.pem", "w") as key_file:
    key_file.write(ssl_key)

# Set permissions on the files immediately
os.chmod("/etc/ssl/private/origin_ca_key.pem", 0o600)
os.chmod("/etc/ssl/certs/origin_ca_cert.pem", 0o644)