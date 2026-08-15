import dbConnect from './mongodb';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function createInitialAdmin() {
  try {
    await dbConnect();
    
    const existingAdmin = await Admin.findOne({ email: 'admin@ardecor.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await Admin.create({
      name: 'AR Decor Admin',
      email: 'admin@ardecor.com',
      passwordHash,
      role: 'admin',
    });

    console.log('Initial admin created successfully');
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
}

export async function createInitialSections() {
  try {
    await dbConnect();
    const { Section } = await import('@/models/Section');
    
    const sections = [
      {
        name: 'Balloon Decor',
        slug: 'balloon-decor',
        description: 'Beautiful, creative & customized decorations for every celebration.',
        coverImage: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=800',
        sortOrder: 1,
        active: true,
      },
      {
        name: 'Wedding Entries',
        slug: 'wedding-entries',
        description: 'Make your special moments unforgettable with spectacular entries and setups.',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        sortOrder: 2,
        active: true,
      },
    ];

    for (const section of sections) {
      const existing = await Section.findOne({ slug: section.slug });
      if (!existing) {
        await Section.create(section);
        console.log(`Created section: ${section.name}`);
      }
    }
  } catch (error) {
    console.error('Error creating initial sections:', error);
  }
}

export async function createInitialCategories() {
  try {
    await dbConnect();
    const { Section } = await import('@/models/Section');
    const { Category } = await import('@/models/Category');
    
    const balloonDecorSection = await Section.findOne({ slug: 'balloon-decor' });
    const weddingEntriesSection = await Section.findOne({ slug: 'wedding-entries' });

    const balloonCategories = [
      { name: 'Birthday Decor', slug: 'birthday-decor', description: 'Colorful and creative birthday decorations' },
      { name: 'Baby Shower', slug: 'baby-shower', description: 'Elegant baby shower celebrations' },
      { name: 'Welcome Baby', slug: 'welcome-baby', description: 'Warm welcome for your little one' },
      { name: 'Name Reveal', slug: 'name-reveal', description: 'Special name reveal ceremonies' },
      { name: 'Anniversary Decor', slug: 'anniversary-decor', description: 'Romantic anniversary setups' },
      { name: 'Engagement Decor', slug: 'engagement-decor', description: 'Beautiful engagement decorations' },
      { name: 'Opening Ceremony', slug: 'opening-ceremony', description: 'Grand opening celebrations' },
      { name: 'Welcome Decor', slug: 'welcome-decor', description: 'Welcoming decorations for guests' },
      { name: 'Room Decoration', slug: 'room-decoration', description: 'Stunning room makeovers' },
      { name: 'Customized Balloon Decor', slug: 'customized-balloon-decor', description: 'Personalized balloon designs' },
    ];

    const weddingCategories = [
      { name: 'Pyro Entry', slug: 'pyro-entry', description: 'Spectacular pyrotechnic entries' },
      { name: 'Smoke Entry', slug: 'smoke-entry', description: 'Dramatic smoke effect entries' },
      { name: 'Balloon Entry', slug: 'balloon-entry', description: 'Fun balloon entry experiences' },
      { name: 'SFX Entry', slug: 'sfx-entry', description: 'Special effects wedding entries' },
      { name: 'Artist Entry', slug: 'artist-entry', description: 'Live artist performances' },
      { name: 'Fire Show', slug: 'fire-show', description: 'Mesmerizing fire performances' },
      { name: 'Haldi Setup', slug: 'haldi-setup', description: 'Traditional haldi ceremony decor' },
      { name: 'Mehndi Setup', slug: 'mehndi-setup', description: 'Beautiful mehndi night decorations' },
      { name: 'Wedding Stage Entry', slug: 'wedding-stage-entry', description: 'Grand stage entry designs' },
      { name: 'Customized Wedding Entry', slug: 'customized-wedding-entry', description: 'Personalized wedding entries' },
    ];

    if (balloonDecorSection) {
      for (let i = 0; i < balloonCategories.length; i++) {
        const cat = balloonCategories[i];
        const existing = await Category.findOne({ sectionId: balloonDecorSection._id, slug: cat.slug });
        if (!existing) {
          await Category.create({
            ...cat,
            sectionId: balloonDecorSection._id.toString(),
            coverImage: `https://source.unsplash.com/random/800x600/?balloon,party,${i}`,
            sortOrder: i,
            active: true,
          });
          console.log(`Created category: ${cat.name}`);
        }
      }
    }

    if (weddingEntriesSection) {
      for (let i = 0; i < weddingCategories.length; i++) {
        const cat = weddingCategories[i];
        const existing = await Category.findOne({ sectionId: weddingEntriesSection._id, slug: cat.slug });
        if (!existing) {
          await Category.create({
            ...cat,
            sectionId: weddingEntriesSection._id.toString(),
            coverImage: `https://source.unsplash.com/random/800x600/?wedding,celebration,${i}`,
            sortOrder: i,
            active: true,
          });
          console.log(`Created category: ${cat.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error creating initial categories:', error);
  }
}

export async function createInitialDesigns() {
  try {
    await dbConnect();
    const { Category } = await import('@/models/Category');
    const { Design } = await import('@/models/Design');
    
    const categories = await Category.find({ active: true });
    
    for (const category of categories) {
      const existingDesigns = await Design.countDocuments({ categoryId: category._id.toString() });
      
      if (existingDesigns === 0) {
        // Create 10 sample designs for each category
        for (let i = 0; i < 10; i++) {
          const isVideo = i % 5 === 0; // Every 5th design is a video placeholder
          
          await Design.create({
            categoryId: category._id.toString(),
            title: `${category.name} Design ${i + 1}`,
            description: `Beautiful ${category.name.toLowerCase()} setup - Design variation ${i + 1}. Perfect for your special occasion.`,
            mediaType: isVideo ? 'video' : 'image',
            mediaUrl: isVideo 
              ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
              : `https://picsum.photos/seed/${category.slug}-${i}/800/600`,
            thumbnailUrl: `https://picsum.photos/seed/${category.slug}-${i}/400/300`,
            featured: i < 3, // First 3 designs are featured
            sortOrder: i,
            active: true,
          });
        }
        console.log(`Created 10 designs for category: ${category.name}`);
      }
    }
  } catch (error) {
    console.error('Error creating initial designs:', error);
  }
}

export async function createInitialSettings() {
  try {
    await dbConnect();
    const { WebsiteSettings } = await import('@/models/WebsiteSettings');
    
    const settings = [
      { key: 'site_title', value: 'AR Decor' },
      { key: 'site_tagline', value: 'We Decorate Your Moments, You Create the Memories.' },
      { key: 'hero_heading', value: 'AR DECOR' },
      { key: 'hero_description', value: 'Premium Event Decoration & Wedding Entry Services' },
      { key: 'hero_image', value: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?w=1920' },
      { key: 'whatsapp_number', value: '8269037288' },
      { key: 'contact_phone', value: '8269037288' },
      { key: 'instagram_link', value: 'https://instagram.com/ardecor' },
      { key: 'about_content', value: 'AR Decor specializes in creating unforgettable event experiences. From intimate celebrations to grand weddings, we bring your vision to life with premium decorations and spectacular entry setups.' },
      { key: 'footer_content', value: '© 2024 AR Decor. All rights reserved.' },
    ];

    for (const setting of settings) {
      const existing = await WebsiteSettings.findOne({ key: setting.key });
      if (!existing) {
        await WebsiteSettings.create(setting);
      }
    }
    console.log('Initial settings created');
  } catch (error) {
    console.error('Error creating initial settings:', error);
  }
}

export async function initializeDatabase() {
  await createInitialAdmin();
  await createInitialSections();
  await createInitialCategories();
  await createInitialDesigns();
  await createInitialSettings();
}
