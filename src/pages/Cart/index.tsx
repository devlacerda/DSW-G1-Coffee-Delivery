import { Fragment, useState } from 'react'
import {
  Bank,
  CreditCard,
  CurrencyDollar,
  Money,
  Trash,
} from '@phosphor-icons/react'

import {
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
  PaymentContainer,
  PaymentErrorMessage,
  PaymentHeading,
  PaymentOptions,
} from './styles'
import { Tags } from '../../components/CoffeeCard/styles';
import { QuantityInput } from '../../components/Form/QuantityInput';
import { Radio } from '../../components/Form/Radio';

export interface Item {
  id: string
  quantity: number
}
export interface Order {
  id: number
  items: CoffeeInCart[]
}

interface CoffeeInCart {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
  subTotal: number;
}

const DELIVERY_PRICE = 3.75;

export function Cart() {
  const [coffeesInCart, setCoffeesInCart] = useState<CoffeeInCart[]>([
    {
      id: "0",
      title: "Expresso Tradicional",
      description: "O tradicional café feito com água quente e grãos moídos",
      tags: ["tradicional", "gelado"],
      price: 6.90,
      image: "/images/coffees/expresso.png",
      quantity: 1,
      subTotal: 6.90,
    },
    {
      id: "1",
      title: "Expresso Americano",
      description: "Expresso diluído, menos intenso que o tradicional",
      tags: ["tradicional", "com leite"],
      price: 9.95,
      image: "/images/coffees/americano.png",
      quantity: 2,
      subTotal: 19.90,
    },
    {
      id: "2",
      title: "Expresso Cremoso",
      description: "Café expresso tradicional com espuma cremosa",
      tags: ["especial"],
      price: 16.50,
      image: "/images/coffees/expresso-cremoso.png",
      quantity: 3,
      subTotal: 49.50,
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'cash'>('cash')

  const totalItemsPrice = coffeesInCart.reduce((acc, coffee) => {
    return acc + coffee.price * coffee.quantity
  }, 0)

  const paymentRates = {
    credit: 3.85,
    debit: 1.85,
    cash: 0,
  }

  function handleItemIncrement(id: string) {
    setCoffeesInCart(prev =>
      prev.map(coffee =>
        coffee.id === id
          ? {
              ...coffee,
              quantity: coffee.quantity + 1,
              subTotal: (coffee.quantity + 1) * coffee.price,
            }
          : coffee
      )
    )
  }

  function handleItemDecrement(id: string) {
    setCoffeesInCart(prev =>
      prev.map(coffee =>
        coffee.id === id && coffee.quantity > 1
          ? {
              ...coffee,
              quantity: coffee.quantity - 1,
              subTotal: (coffee.quantity - 1) * coffee.price,
            }
          : coffee
      )
    )
  }

  function handleItemRemove(id: string) {
    setCoffeesInCart(prev => prev.filter(coffee => coffee.id !== id))
  }

  const calculateFinalAmount = () => {
    const rate = paymentRates[paymentMethod]
    const totalWithFrete = totalItemsPrice + DELIVERY_PRICE
    return totalWithFrete * (1 + rate / 100)
  }

  return (
    <Container>
      <InfoContainer>
        <PaymentContainer>
          <PaymentHeading>
            <CurrencyDollar size={22} />
            <div>
              <span>Pagamento</span>
              <p>
                O pagamento é feito na entrega. Escolha a forma que deseja pagar
              </p>
            </div>
          </PaymentHeading>

          <PaymentOptions>
            <div>
              <Radio
                isSelected={paymentMethod === 'credit'}
                onClick={() => setPaymentMethod('credit')}
                value="credit"
              >
                <CreditCard size={16} />
                <span>Cartão de crédito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'debit'}
                onClick={() => setPaymentMethod('debit')}
                value="debit"
              >
                <Bank size={16} />
                <span>Cartão de débito</span>
              </Radio>

              <Radio
                isSelected={paymentMethod === 'cash'}
                onClick={() => setPaymentMethod('cash')}
                value="cash"
              >
                <Money size={16} />
                <span>Pix ou Dinheiro</span>
              </Radio>
            </div>

            {/* Exibir erro se quiser validar */}
            {/* <PaymentErrorMessage role="alert">
              <span>Selecione uma forma de pagamento</span>
            </PaymentErrorMessage> */}
          </PaymentOptions>
        </PaymentContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {coffeesInCart.map(coffee => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />
                  <div>
                    <span>{coffee.title}</span>
                    <Tags>
                      {coffee.tags.map(tag => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </Tags>

                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() => handleItemIncrement(coffee.id)}
                        decrementQuantity={() => handleItemDecrement(coffee.id)}
                      />

                      <button onClick={() => handleItemRemove(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>

                <aside>R$ {coffee.subTotal.toFixed(2)}</aside>
              </Coffee>
              <span />
            </Fragment>
          ))}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>
                {totalItemsPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>

            <div>
              <span>Entrega</span>
              <span>
                {DELIVERY_PRICE.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>

            <div>
              <span>Total</span>
              <span>
                {calculateFinalAmount().toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="submit" form="order">
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
