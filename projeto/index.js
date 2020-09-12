console.log('-----------------------------------------------------------------------')
console.log('                   Projeto Carrinho de Compras     ')
console.log('-----------------------------------------------------------------------')

const read = require('readline-sync')

const db = require(`./database.js`)

const { produtos } = db

produtos.sort((a, b) => a.preco - b.preco)

const hoje = new Date()
const dia = hoje.getDate()
const mes = hoje.getMonth()
const ano = hoje.getFullYear()
const hora = hoje.getHours()
const min = hoje.getMinutes()
const sec = hoje.getSeconds()
const somenteData = `${dia}/${mes + 1}/${ano}`
const organizandoData = `Data: ${dia}/${mes + 1}/${ano}   Hora: ${hora}:${min}:${sec}`
console.log(organizandoData)

const vendasDoDia = new Array()
let totalDoDia = 0
let fimDoDia = 'N'
let totalItensVendidos = 0

do {
  const array = new Array()
  class Pedido {
    constructor(array) {
      this.products = array
      this.data = organizandoData
      this.subtotal = 0
      this.desconto = 0
      this.total = 0
      this.totalItens = 0
    }
    calcularSubtotal() {
      this.subtotal = this.products.reduce((acumulador, item) => acumulador + (item.preco * item.quantidade), 0)
    }
    calcularDesconto(valor_desconto) {
      this.desconto = (valor_desconto > 0 && valor_desconto <= 15) ? this.subtotal * (valor_desconto / 100) : 0
    }
    calcularTotal() {
      this.total = (this.subtotal - this.desconto)
    }
    calcularTotalItens() {
      this.totalItens = this.products.reduce((acumulador, itens) => acumulador + itens.quantidade, 0)
    }
  }
  let confirmar = 'S'
  do {
    const verProdutos = read.question('Voce deseja ver os produtos de alguma categoria especifica? (S/N) ')
    if (verProdutos.toUpperCase() === 'S') {
      console.log('-----------------------------------------------------------------------')
      console.log('Essas são as categorias: Alimento, Bebida, Casa, Higiene, informatica')
      console.log('-----------------------------------------------------------------------')

      const qualCategoria = read.question('voce esta procurando produtos de qual categoria? ').toLowerCase()
      const categorias = produtos.filter(item => item.categoria === qualCategoria)
      console.table(categorias)
    } else if (verProdutos.toUpperCase() === 'N') {
      console.table(produtos)
    } else {
      console.log('Opção inválida! Esses são todos os nosso produtos disponiveis!')
      console.table(produtos)
    }
    console.log('-----------------------------------------------------------------------')
    const entradaId = parseInt(read.question('Digite o ID do item desejado: '))
    let entradaQuantidade = 0
    while (entradaQuantidade < 1) {
      entradaQuantidade = parseInt(read.question('Digite a quantidade: '))
    }
    console.log('-----------------------------------------------------------------------')
    function procurar(produto) {
      return produto.id === entradaId
    }
    const produtoEncontrado = produtos.find(procurar)
    if (!produtoEncontrado) {
      console.log('Erro. Produto nao encontrado!')
    } else {
      const produtoPedido = { ...produtoEncontrado, quantidade: entradaQuantidade }
      array.push(produtoPedido)
    }
    confirmar = read.question('Voce deseja comprar mais algum item? (S/N) ')
  } while (confirmar.toUpperCase() === 'S')

  const pedido = new Pedido(array)

  const cupom = parseInt(read.question("Digite o valor do seu cupom de desconto: (digite 0 se nao tiver um) "))

  console.table(pedido.products)

  pedido.calcularSubtotal()
  console.log(`Subtotal: ${pedido.subtotal.toFixed(2)}`)


  pedido.calcularDesconto(cupom)
  console.log(`Valor do desconto: R$ ${pedido.desconto.toFixed(2)}`)

  pedido.calcularTotal()
  console.log(`Total: ${pedido.total.toFixed(2)}`)

  pedido.calcularTotalItens()
  console.log(`Total de itens comprados: ${pedido.totalItens.toFixed(2)}`)

  vendasDoDia.push(pedido)

  totalDoDia = totalDoDia + pedido.total
  totalItensVendidos = totalItensVendidos + pedido.totalItens

  console.log(pedido.data)
  console.log('-----------------------------------------------------------------------')
  fimDoDia = read.question('Voce deseja encerrar o expediente? ')
} while (fimDoDia.toUpperCase() === 'N')

for (let i = 0; i < vendasDoDia.length; i++) {
  console.log(vendasDoDia[i])
}
console.log(`Durante o dia ${somenteData} você vendeu ${totalItensVendidos} itens e teve um lucro de R$ ${totalDoDia.toFixed(2)}`)