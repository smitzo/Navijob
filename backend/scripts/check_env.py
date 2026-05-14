import os

required = ["DATABASE_URL", "DJANGO_SECRET_KEY"]
missing = [key for key in required if not os.getenv(key)]

if missing:
    print("Missing:", ", ".join(missing))
else:
    print("Backend env looks OK")
