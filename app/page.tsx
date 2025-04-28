"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [memory, setMemory] = useState<number>(0)
  const [isScientific, setIsScientific] = useState(false)
  const [isRadians, setIsRadians] = useState(true)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (operator === "+") {
      return firstOperand! + inputValue
    } else if (operator === "-") {
      return firstOperand! - inputValue
    } else if (operator === "*") {
      return firstOperand! * inputValue
    } else if (operator === "/") {
      return firstOperand! / inputValue
    } else if (operator === "^") {
      return Math.pow(firstOperand!, inputValue)
    } else if (operator === "root") {
      return Math.pow(firstOperand!, 1 / inputValue)
    }

    return inputValue
  }

  const handleEquals = () => {
    if (!operator) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handlePercentage = () => {
    const currentValue = Number.parseFloat(display)
    const percentValue = currentValue / 100
    setDisplay(String(percentValue))
  }

  const toggleSign = () => {
    const newValue = Number.parseFloat(display) * -1
    setDisplay(String(newValue))
  }

  const handleScientificFunction = (func: string) => {
    const currentValue = Number.parseFloat(display)
    let result: number

    switch (func) {
      case "sin":
        result = isRadians ? Math.sin(currentValue) : Math.sin((currentValue * Math.PI) / 180)
        break
      case "cos":
        result = isRadians ? Math.cos(currentValue) : Math.cos((currentValue * Math.PI) / 180)
        break
      case "tan":
        result = isRadians ? Math.tan(currentValue) : Math.tan((currentValue * Math.PI) / 180)
        break
      case "log":
        result = Math.log10(currentValue)
        break
      case "ln":
        result = Math.log(currentValue)
        break
      case "sqrt":
        result = Math.sqrt(currentValue)
        break
      case "square":
        result = Math.pow(currentValue, 2)
        break
      case "cube":
        result = Math.pow(currentValue, 3)
        break
      case "1/x":
        result = 1 / currentValue
        break
      case "exp":
        result = Math.exp(currentValue)
        break
      default:
        result = currentValue
    }

    setDisplay(String(result))
    setWaitingForSecondOperand(true)
  }

  const handleConstant = (constant: string) => {
    if (constant === "pi") {
      setDisplay(String(Math.PI))
    } else if (constant === "e") {
      setDisplay(String(Math.E))
    }
    setWaitingForSecondOperand(true)
  }

  const handleMemory = (action: string) => {
    const currentValue = Number.parseFloat(display)

    switch (action) {
      case "MC":
        setMemory(0)
        break
      case "MR":
        setDisplay(String(memory))
        setWaitingForSecondOperand(true)
        break
      case "M+":
        setMemory(memory + currentValue)
        setWaitingForSecondOperand(true)
        break
      case "M-":
        setMemory(memory - currentValue)
        setWaitingForSecondOperand(true)
        break
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-none shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 pb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="scientific-mode"
                checked={isScientific}
                onCheckedChange={setIsScientific}
                className="data-[state=checked]:bg-pink-400"
              />
              <Label htmlFor="scientific-mode" className="text-sm font-medium text-white">
                Scientific
              </Label>
            </div>
            {isScientific && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="angle-mode"
                  checked={isRadians}
                  onCheckedChange={setIsRadians}
                  className="data-[state=checked]:bg-pink-400"
                />
                <Label htmlFor="angle-mode" className="text-sm font-medium text-white">
                  {isRadians ? "RAD" : "DEG"}
                </Label>
              </div>
            )}
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 shadow-inner">
            <div className="text-right text-3xl font-bold text-white overflow-hidden">{display}</div>
          </div>
        </CardHeader>
        <CardContent className="bg-white p-6 pt-8">
          {isScientific && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Button
                onClick={() => handleMemory("MC")}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 h-12 rounded-xl font-medium shadow-sm"
              >
                MC
              </Button>
              <Button
                onClick={() => handleMemory("MR")}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 h-12 rounded-xl font-medium shadow-sm"
              >
                MR
              </Button>
              <Button
                onClick={() => handleMemory("M+")}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 h-12 rounded-xl font-medium shadow-sm"
              >
                M+
              </Button>
              <Button
                onClick={() => handleMemory("M-")}
                className="bg-pink-100 hover:bg-pink-200 text-pink-800 h-12 rounded-xl font-medium shadow-sm"
              >
                M-
              </Button>
            </div>
          )}

          {isScientific && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Button
                onClick={() => handleScientificFunction("sin")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                sin
              </Button>
              <Button
                onClick={() => handleScientificFunction("cos")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                cos
              </Button>
              <Button
                onClick={() => handleScientificFunction("tan")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                tan
              </Button>
              <Button
                onClick={() => handleScientificFunction("1/x")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                1/x
              </Button>
            </div>
          )}

          {isScientific && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Button
                onClick={() => handleScientificFunction("log")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                log
              </Button>
              <Button
                onClick={() => handleScientificFunction("ln")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                ln
              </Button>
              <Button
                onClick={() => handleScientificFunction("sqrt")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                √x
              </Button>
              <Button
                onClick={() => handleScientificFunction("square")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                x²
              </Button>
            </div>
          )}

          {isScientific && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Button
                onClick={() => handleScientificFunction("cube")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                x³
              </Button>
              <Button
                onClick={() => handleOperator("^")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                x^y
              </Button>
              <Button
                onClick={() => handleConstant("pi")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                π
              </Button>
              <Button
                onClick={() => handleConstant("e")}
                className="bg-violet-100 hover:bg-violet-200 text-violet-800 h-12 rounded-xl font-medium shadow-sm"
              >
                e
              </Button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={clearDisplay}
              className="bg-red-500 hover:bg-red-600 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              C
            </Button>
            <Button
              onClick={toggleSign}
              className="bg-purple-200 hover:bg-purple-300 text-purple-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              +/-
            </Button>
            <Button
              onClick={handlePercentage}
              className="bg-purple-200 hover:bg-purple-300 text-purple-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              %
            </Button>
            <Button
              onClick={() => handleOperator("/")}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              ÷
            </Button>

            <Button
              onClick={() => inputDigit("7")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              7
            </Button>
            <Button
              onClick={() => inputDigit("8")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              8
            </Button>
            <Button
              onClick={() => inputDigit("9")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              9
            </Button>
            <Button
              onClick={() => handleOperator("*")}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              ×
            </Button>

            <Button
              onClick={() => inputDigit("4")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              4
            </Button>
            <Button
              onClick={() => inputDigit("5")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              5
            </Button>
            <Button
              onClick={() => inputDigit("6")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              6
            </Button>
            <Button
              onClick={() => handleOperator("-")}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              -
            </Button>

            <Button
              onClick={() => inputDigit("1")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              1
            </Button>
            <Button
              onClick={() => inputDigit("2")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              2
            </Button>
            <Button
              onClick={() => inputDigit("3")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              3
            </Button>
            <Button
              onClick={() => handleOperator("+")}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              +
            </Button>

            <Button
              onClick={() => inputDigit("0")}
              className="col-span-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xl h-14 rounded-xl font-medium shadow-md"
            >
              .
            </Button>
            <Button
              onClick={handleEquals}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white text-xl h-14 rounded-xl font-medium shadow-md"
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
