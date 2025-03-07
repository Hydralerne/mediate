export const SECTION_TYPES = {
    ABOUT: 'About Me',
    PORTFOLIO: 'Portfolio Showcase',
    PRODUCTS: 'Products',
    VIDEOS: 'Videos',
    BLOG: 'Blog Posts',
    SERVICES: 'Services',
    CONTACT: 'Contact Form'
};

export const INITIAL_SECTIONS = [
    { 
        id: 'about', 
        title: 'About Me', 
        description: 'Share your story and background',
        active: true,
        type: SECTION_TYPES.ABOUT,
        // icon: require('../../../assets/icons/home/user information-309-1658436041.png'),
        items: [
            { id: 'about-1', title: 'Personal Bio', type: 'text' }
        ]
    },
    { 
        id: 'portfolio', 
        title: 'Portfolio Showcase', 
        description: 'Display your work and projects',
        active: true,
        type: SECTION_TYPES.PORTFOLIO,
        // icon: require('../../../assets/icons/home/roadmap-47-1681196106.png'),
        items: [
            { id: 'portfolio-1', title: 'Design Project', type: 'project' },
            { id: 'portfolio-2', title: 'Mobile App', type: 'project' }
        ]
    },
    { 
        id: 'products', 
        title: 'Products', 
        description: 'Showcase items you\'re selling',
        active: true,
        type: SECTION_TYPES.PRODUCTS,
        // icon: require('../../../assets/icons/home/store-116-1658238103.png'),
        items: [
            { id: 'products-1', title: 'Product 1', type: 'product' }
        ]
    },
    { 
        id: 'blog', 
        title: 'Blog Posts', 
        description: 'Share your thoughts and articles',
        active: true,
        type: SECTION_TYPES.BLOG,
        // icon: require('../../../assets/icons/home/feedly-180-1693375492.png'),
        items: [
            { id: 'blog-1', title: 'My First Post', type: 'post' }
        ]
    },
    { 
        id: 'contact', 
        title: 'Contact Form', 
        description: 'Let visitors get in touch with you',
        active: true,
        type: SECTION_TYPES.CONTACT,
        // icon: require('../../../assets/icons/home/email sendng-69-1659689482.png'),
        items: [
            { id: 'contact-1', title: 'Contact Form', type: 'form' }
        ]
    }
]; 