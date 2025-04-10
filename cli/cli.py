import yaml
import json
import os
import subprocess
import click
from collections.abc import Mapping

prj_src = os.environ['BIKAMP_PATH']

def add_meta_to_cli(cli):
    with open(f"{prj_src}/meta.yaml") as f:
        meta = yaml.safe_load(f)
    

    def add_commands(parent, commands):
        for name, config in commands.items():
            if isinstance(config, Mapping):
				
                cmd = click.Group(name=name)
                parent.add_command(cmd)
                add_commands(cmd, config)
            else:    
                cmd = click.Command(
                    name=name,
                    callback=call(config),
                    short_help=f"Executa: {config}"
                )
                parent.add_command(cmd)

    add_commands(cli, meta["scripts"])
    return cli

@click.command()
@click.pass_context
def stats(ctx):
    """Mostra o status dos serviços"""

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
        click.echo(f"{s:>{max_r}} {estado}")

def call(command):
    return lambda: subprocess.run(
        command,
        shell=True,
        cwd=prj_src,
        check=True
    )

@click.group()
def cli():
    pass

add_meta_to_cli(cli)
cli.add_command(stats)

if __name__ == "__main__":
    cli.main()