"""Aula 11 - Lógica de Programação | Desafio Garagem Inteligente

Complete apenas os trechos TODO. Execute em um compilador Python online.
"""

class Carro:
    def __init__(self, marca, modelo, ano):
        # Os atributos guardam as características de cada carro.
        self.marca = marca
        self.modelo = modelo
        self.ano = ano

    def exibirInfo(self):
        print(f"Marca do carro: {self.marca}\nModelo {self.modelo}\nAno {self.ano}")

    def buzina(self):
        print(f"{self.marca} buzina")

    def farol(self):
        print(f"{self.marca} deixa voce cego")


carro1 = Carro("Fiat", "Uno", 1984)
carro2 = Carro("BMW", "iX1 xDrive30", 2023)
# exibirInfo() imprime os dados do objeto carro
carro1.exibirInfo()
carro2.exibirInfo()
carro2.farol()

