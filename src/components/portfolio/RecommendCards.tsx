"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RECOMMEND_PROFILES, RecommendProfile } from "@/constants/recommendations";
import { MOCK_FUNDS } from "@/mock/funds";

interface Props {
  onApply: (profile: RecommendProfile) => void;
}

export function RecommendCards({ onApply }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground px-1">
        タップで即反映。あとから配分は自由に変更できます。
      </p>
      <div className="space-y-2">
        {RECOMMEND_PROFILES.map((profile) => (
          <Card
            key={profile.id}
            className="cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all active:scale-[0.99]"
            onClick={() => onApply(profile)}
          >
            <CardContent className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{profile.emoji}</span>
                    <span className="text-sm font-semibold">{profile.label}</span>
                    <Badge variant="secondary" className="text-xs py-0">
                      {profile.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {profile.description}
                  </p>
                  {/* 銘柄プレビュー */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.allocations.map(({ fundId, allocation }) => {
                      const fund = MOCK_FUNDS.find((f) => f.id === fundId);
                      if (!fund) return null;
                      const shortName = fund.name
                        .replace("eMAXIS Slim ", "")
                        .replace("インデックス", "")
                        .replace("・ファンド", "");
                      return (
                        <span
                          key={fundId}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {shortName} {allocation}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
