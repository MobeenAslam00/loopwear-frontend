"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: { categories: string[], maxPrice: number }) => void
}

export function FilterSheet({ open, onOpenChange, onApplyFilters }: FilterSheetProps) {
  const [priceRange, setPriceRange] = React.useState([20000])
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== category))
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      maxPrice: priceRange[0]
    })
    onOpenChange(false)
  }

  const handleResetFilters = () => {
    setPriceRange([20000])
    setSelectedCategories([])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#F6E7DB]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Filter</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-8">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">By Price</h3>
            <Slider
              defaultValue={[20000]}
              max={200000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              0 Rs - {priceRange[0]} Rs
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">By Category</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bridal" 
                  checked={selectedCategories.includes("Bridal")}
                  onCheckedChange={(checked) => 
                    handleCategoryChange("Bridal", checked as boolean)
                  }
                />
                <label htmlFor="bridal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Bridal
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="party-wear" 
                  checked={selectedCategories.includes("Party Wear")}
                  onCheckedChange={(checked) => 
                    handleCategoryChange("Party Wear", checked as boolean)
                  }
                />
                <label htmlFor="party-wear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Party Wear
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="non-bridal" 
                  checked={selectedCategories.includes("Non-Bridal")}
                  onCheckedChange={(checked) => 
                    handleCategoryChange("Non-Bridal", checked as boolean)
                  }
                />
                <label htmlFor="non-bridal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Non-Bridal
                </label>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="w-full"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="w-full bg-[#6E391D] hover:bg-[#542D18]"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
