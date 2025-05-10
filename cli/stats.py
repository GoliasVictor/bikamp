import json
import yaml
import os 
import subprocess

prj_src = os.environ['BIKAMP_PATH']

with open(prj_src+"/docker-compose.yml") as stream:
    try:
        compose = yaml.safe_load(stream)
    except yaml.YAMLError as exc:
        print(exc)
services = compose['services'].keys()
for s in services:
     
    result = subprocess.run(f"docker compose ps {s} --all --format json".split(), capture_output=True, text=True)
    output = result.stdout.strip()
    if output != "":
        d_estado = json.loads(output)["State"]
        estado=d_estado
        if d_estado in ["paused", "restarting", "removing", "dead", "created", "exited"]:
            estado = "desativado"
        if d_estado == "running":
            estado = "ativado"
    else:
        d_estado="not_created"
        estado="desativado"
    max_r = max(map(len, services))
    print(f"{s:>{max_r}}", estado)