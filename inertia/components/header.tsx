import { Card } from "./ui/card"
import { Input } from "./ui/input"

export function Header() {
    return ( 
        <div className="flex justify-center items-center py-8">
            <Card className="w-full max-w-2xl px-8 py-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Hermes</h1>
                    <p className="text-center"><Input placeholder="Search..." className="max-w-xs" /></p>
                    <p className="text-gray-600">Citadelle Lab</p>
                </div>
            </Card>
        </div>
    )
}