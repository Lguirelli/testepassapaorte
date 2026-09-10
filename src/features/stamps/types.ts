/* eslint-disable */
export type StampStatus = 'first_visit'|'visited'|'return'|'favorite'|'special'|'completed_route'|'seasonal';
export interface StampData {
  partnerId: string; partnerName: string; category: string; subcategory?: string;
  stampId?: string; visitId?: string; visitDate?: string; visitNumber?: number;
  city?: string; state?: string; country?: string; route?: string; status?: StampStatus;
  customIcon?: string; customColor?: string; customShape?: string; customLayout?: string;
  preferredShapes?: string[]; preferredColors?: string[]; seed?: string; rendererVersion?: number;
}
export interface StampTheme { id: string; version: number; palette: string[]; background: string }
export interface StampOptions {
  size?: number|'sm'|'md'|'lg'; textureLevel?: number; showLocation?: boolean;
  showVisitNumber?: boolean; animated?: boolean; rotation?: boolean;
  detail?: 'compact'|'normal'|'full'; variationMode?: 'partner'|'visit';
  preview?: boolean; ariaLabel?: string; theme?: StampTheme;
}
export interface IconDefinition { id: string; label: string; svg: string; aliases: string[]; keywords?: string[] }
export interface ShapeDefinition { id: string; label: string; path: string; safeArea: {x:number;y:number;width:number;height:number}; supportedLayouts: string[]; contentTransform?: {x:number;y:number;scaleX:number;scaleY:number} }
export interface GeneratedStamp {
  seed: string; rendererVersion: number; themeVersion: number; iconLibraryVersion: number;
  shape: ShapeDefinition; layout: string; color: string; icon: IconDefinition; rotation: number;
  texture: { level: number; seed: number }; typography: { family: string };
  data: StampData; options: StampOptions;
}
