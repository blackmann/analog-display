import AnalogScreen from "./analog-screen.js"

function main() {
  const analogScreen = new AnalogScreen({ pixelSize: 5, gutter: 1 })

  analogScreen.setText('NOT GR!')
  analogScreen.render()
}

main()
