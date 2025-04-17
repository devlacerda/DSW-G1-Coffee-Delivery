import { Heart } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'

import { QuantityInput } from '../Form/QuantityInput'
import {
  CoffeeImg,
  Container,
  Control,
  Description,
  Order,
  Price,
  Tags,
  Title,
} from './styles'

type CoffeeCardProps = {
  coffee: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    price: number;
    image: string;
    quantity: number
    favorite: boolean;
  },
  incrementQuantity: (id: string) => void
  decrementQuantity: (id: string) => void
  handleFavoriteCoffee: (id: string) => void
}

export function CoffeeCard({
  coffee,
  incrementQuantity,
  decrementQuantity,
  handleFavoriteCoffee
}: CoffeeCardProps) {
  const theme = useTheme()

  return (
    <Container
      style={{
        border: coffee.favorite ? '2px solid red' : '1px solid transparent',
        borderRadius: '8px'
      }}
    >
      <CoffeeImg src={coffee.image} alt={coffee.title} />

      <Tags>
        {coffee.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Tags>

      <Title>{coffee.title}</Title>

      <Description>{coffee.description}</Description>

      <Control>
        <Price>
          <span>R$</span>
          <span>{coffee.price.toFixed(2)}</span>
        </Price>

        <Order $itemAdded={false}>
          <QuantityInput
            quantity={coffee.quantity }
            incrementQuantity={() => incrementQuantity(coffee.id)}
            decrementQuantity={() => decrementQuantity(coffee.id)}
          />

          <button
            onClick={() => handleFavoriteCoffee(coffee.id)}
            style={{border: 'none'}}
            aria-label="Favoritar"
          >
            <Heart
              size={22}
              weight={coffee.favorite ? 'fill' : 'regular'}
              color={coffee.favorite ? 'red' : theme.colors['base-card']}
            />
          </button>
        </Order>
      </Control>
    </Container>
  )
}