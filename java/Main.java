// Aula 11 - Lógica de Programação | Desafio Garagem Inteligente
// Complete os trechos TODO. Execute em um compilador Java online.

class Carro {
    String marca;
    String modelo;
    int ano;

    Carro(String marca, String modelo, int ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    void exibirInfo() {
        System.out.println("Marca" + marca + "\nModelo" + modelo + "\nAno" + ano);
    }
    void buzina() {
        System.out.println(marca + ": HONK!");
    }
}

public class Main {
    public static void main(String[] args) {
        Carro carro1 = new Carro("BMW", "X1", 2019);
        // Exemplo: Carro carro1 = new Carro("...", "...", 2020);

        // TODO 3: chame exibirInfo() nos DOIS objetos.
        carro1.exibirInfo();
        carro2.exibirInfo();
        carro1.buzina();
    }
}
