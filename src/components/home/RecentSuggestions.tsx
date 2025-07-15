import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ContentRow } from './ExploreSection';
import { ContentItem } from '@/data/contentItem';

const RecentSuggestions = ({recentSuggestions,navigate} : {recentSuggestions: ContentItem[]; navigate: ReturnType<typeof useNavigate>}) => {
  return (
    <div className="p-6 pt-0">
          
          {recentSuggestions.length > 0 ? (
            
            <ContentRow contentArray={recentSuggestions} heading={"Recent Suggestions"} isMobile={false} navigate={navigate} />
            
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-accent/30 rounded-lg">
              <p>Your recent suggestions will appear here.</p>
              <p className="mt-2">
                Use the{" "}
                <span className="text-primary font-medium">Suggest</span> button
                to start recommending content to your friends!
              </p>
            </div>
          )}
        </div>
  )
}

export default RecentSuggestions