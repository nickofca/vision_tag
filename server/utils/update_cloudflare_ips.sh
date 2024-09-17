#!/bin/zsh

# Replace with your Security Group ID
SECURITY_GROUP_ID="sg-0bf256292420a4269"

# Fetch Cloudflare IP ranges
CF_IPV4_URL="https://www.cloudflare.com/ips-v4"
CF_IPV6_URL="https://www.cloudflare.com/ips-v6"
CF_IPV4=$(curl -s $CF_IPV4_URL)
CF_IPV6=$(curl -s $CF_IPV6_URL)

# Create permission block for IPv4
ipv4_permissions="IpProtocol=tcp,FromPort=8000,ToPort=8000,IpRanges=["
for ip in $(echo $CF_IPV4); do
  ipv4_permissions+="{CidrIp=$ip,Description=\"Cloudflare Access\"},"
done
ipv4_permissions=${ipv4_permissions%,}]  # Remove trailing comma

# Create permission block for IPv6
ipv6_permissions="IpProtocol=tcp,FromPort=8000,ToPort=8000,Ipv6Ranges=["
for ip in $(echo $CF_IPV6); do
  ipv6_permissions+="{CidrIpv6=$ip,Description=\"Cloudflare Access\"},"
done
ipv6_permissions=${ipv6_permissions%,}]  # Remove trailing comma

# Authorize security group ingress for both IPv4 and IPv6
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --ip-permissions "$ipv4_permissions" "$ipv6_permissions" \
  --no-cli-pager

# Authorize security group egress for both IPv4 and IPv6
aws ec2 authorize-security-group-egress \
  --group-id $SECURITY_GROUP_ID \
  --ip-permissions "$ipv4_permissions" "$ipv6_permissions" \
  --no-cli-pager

echo "IPv4 permissions: $ipv4_permissions"
echo "IPv6 permissions: $ipv6_permissions"
echo "Cloudflare IPs for port 8000 added to security group: $SECURITY_GROUP_ID"