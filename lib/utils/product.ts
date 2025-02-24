import { supabase } from '../supabase/client';

export async function uploadProductImages(files: File[]) {
  const imageUrls = [];
  
  for (const file of files) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
  
  return imageUrls;
}

export async function createProduct(productData: any, images: File[]) {
  try {
    const imageUrls = await uploadProductImages(images);
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        images: imageUrls,
        status: 'available'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}