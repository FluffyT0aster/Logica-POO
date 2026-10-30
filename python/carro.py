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
        # TODO 1: substitua pass por um print() que mostre marca, modelo e ano.
        print(f"Marca do carro: {self.marca}\nModelo {self.modelo}\nAno{self.ano}")
        # Dica: print(f"Marca: {self.marca} | Modelo: {self.modelo} | Ano: {self.ano}")
    def buzina(self):
        print(f"{self.modelo} buzina")

    def farol(self):
        print(f"{self.modelo} deixa voce cego")

# TODO 2: crie DOIS objetos usando a classe Carro.
carro1 = Carro("Fiat", "Uno", 1984)
carro2 = Carro("BMW", "iX1 xDrive30", 2023)
# Sugestão: use carros de marcas, modelos e anos diferentes.
# carro1 = Carro("...", "...", 2020)
# carro2 = Carro("...", "...", 2024)

carro1.exibirInfo()
carro2.exibirInfo()
carro2.farol()
# TODO 3: chame exibirInfo() para os DOIS objetos criados.
# Dica: carro1.exibirInfo()
