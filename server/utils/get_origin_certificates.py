import boto3
import os

def get_secret(secret_name):
    client = boto3.client("secretsmanager")
    response = client.get_secret_value(SecretId=secret_name)
    return response["SecretString"]

ssl_cert = get_secret("origin-ca-cert")
ssl_key = get_secret("origin-ca-key")

# Store them temporarily in a secure file if needed
with open("/etc/ssl/certs/origin_ca_cert.pem", "w") as cert_file:
    cert_file.write(ssl_cert)
with open("/etc/ssl/private/origin_ca_key.pem", "w") as key_file:
    key_file.write(ssl_key)

# Set permissions on the files immediately
os.chmod("/etc/ssl/private/origin_ca_key.pem", 0o600)
os.chmod("/etc/ssl/certs/origin_ca_cert.pem", 0o644)