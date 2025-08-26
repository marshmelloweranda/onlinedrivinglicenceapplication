import json
import base64
import requests
from flask import Flask, redirect, request
from authlib.integrations.requests_client import OAuth2Sessions
from authlib.oauth2.rfc7523 import PrivateKeyJWT
import jwt