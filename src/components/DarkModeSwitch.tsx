import { useColorMode, Switch } from '@chakra-ui/react'

export const DarkModeSwitch = ({ fixed = true }: { fixed?: boolean }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Switch
      position={fixed ? 'fixed' : undefined}
      top="1rem"
      right="1rem"
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  )
}
