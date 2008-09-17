/**
  * LzAsset.as
  *
  * @copyright Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author André Bargull
  */
final class LzAsset {
    #passthrough (toplevel:true) {
        import flash.utils.getQualifiedSuperclassName;
    }#
    
    private static const BAD_ASSET :String = "bad asset";
    
    private static const BITMAP_ASSET :String = "mx.core::BitmapAsset";
    private static const BUTTON_ASSET :String = "mx.core::ButtonAsset";
    private static const BYTEARRAY_ASSET :String = "mx.core::ByteArrayAsset";
    private static const FONT_ASSET :String = "mx.core::FontAsset";
    private static const MOVIECLIP_ASSET :String = "mx.core::MovieClipAsset";
    private static const MOVIECLIPLOADER_ASSET :String = "mx.core::MovieClipLoaderAsset";
    private static const SPRITE_ASSET :String = "mx.core::SpriteAsset";
    private static const TEXTFIELD_ASSET :String = "mx.core::TextFieldAsset";
    private static const SOUND_ASSET :String = "mx.core::SoundAsset";
    
    /**
      * @param String id: resource-name
      * @return String: the asset-type
      */
    public static function getAssetType (id:String) :String {
        var rsc:Object = LzResourceLibrary[id];
        if (rsc != null) {
            var type:String = rsc['assettype'];
            if (type == null) {
                var clazz:* = rsc['assetclass'];
                if (clazz is Class) {
                    type = getQualifiedSuperclassName(clazz);
                } else {
                    //multiframe resource
                    clazz = rsc['frames'] && rsc['frames'][0];
                    if (clazz is Class) {
                        type = getQualifiedSuperclassName(clazz);
                    } else {
                        if ($debug) {
                            Debug.error("unknown resource-type: ", rsc);
                        }
                        type = BAD_ASSET;
                    }
                }
                rsc['assettype'] = type;
            }
            return type;
        }
        
        return null;
    }
    
    /**
      * Tests whether the resource with name "id" is a BitmapAsset.
      * 
      * @param String id: resource-name
      * @return Boolean: true if resource is a BitmapAsset
      */
    public static function isBitmapAsset (id:String) :Boolean {
        return getAssetType(id) == BITMAP_ASSET;
    }
    
    /**
      * Tests whether the resource with name "id" is a FontAsset.
      * 
      * @param String id: resource-name
      * @return Boolean: true if resource is a FontAsset
      */
    public static function isFontAsset (id:String) :Boolean {
        return getAssetType(id) == FONT_ASSET;
    }
    
    /**
      * Tests whether the resource with name "id" is a MovieClipAsset.
      * 
      * @param String id: resource-name
      * @return Boolean: true if resource is a MovieClipAsset
      */
    public static function isMovieClipAsset (id:String) :Boolean {
        return getAssetType(id) == MOVIECLIP_ASSET;
    }
    
    /**
      * Tests whether the resource with name "id" is a MovieClipLoaderAsset.
      * 
      * @param String id: resource-name
      * @return Boolean: true if resource is a MovieClipLoaderAsset
      */
    public static function isMovieClipLoaderAsset (id:String) :Boolean {
        return getAssetType(id) == MOVIECLIPLOADER_ASSET;
    }
    
    /**
      * Tests whether the resource with name "id" is a SoundAsset.
      * 
      * @param String id: resource-name
      * @return Boolean: true if resource is a SoundAsset
      */
    public static function isSoundAsset (id:String) :Boolean {
        return getAssetType(id) == SOUND_ASSET;
    }
}
