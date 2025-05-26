"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TabType } from "./search-page"
import { MobileTabsView } from "./mobile-tabs-view"

interface SearchTabsProps {
  tabs: TabType[]
  activeTab: string
  setActiveTab: (tab: string) => void
  isMobile: boolean
}

export function SearchTabs({ tabs, activeTab, setActiveTab, isMobile }: SearchTabsProps) {
  if (isMobile) {
    return <MobileTabsView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return (
    <div className="mb-4 w-full max-w-[100%] overflow-x-hidden">
      <div className="flex flex-row gap-2 overflow-x-auto snap-x snap-mandatory whitespace-nowrap w-full max-w-[100%] pb-1">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "outline"}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "snap-center px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 text-xs sm:text-xs md:text-sm lg:text-base rounded-full min-w-[40px] sm:min-w-[50px] lg:min-w-[60px] flex-shrink-0 box-border",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-accent",
            )}
            aria-current={activeTab === tab.value ? "true" : "false"}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
