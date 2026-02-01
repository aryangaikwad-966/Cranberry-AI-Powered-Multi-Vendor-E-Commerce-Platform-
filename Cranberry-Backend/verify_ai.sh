#!/bin/bash
echo "Checking AI Health Endpoint..."
curl -s http://localhost:8080/api/ai/health | jq .
