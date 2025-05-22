// Project data types
export interface Project {
    id: string
    title: string
    description: string
    image: string
    category: string
    technologies: string[]
    color: string
    client: string
    year: string
    challenge: string
    solution: string
    results: string
    testimonial: {
      quote: string
      author: string
      role: string
    }
    gallery: string[]
  }
  
  // Extended projects data with full case study content
  export const allProjects: Project[] = [
    {
      id: "1",
      title: "FastBite Chain POS Implementation",
      description: "Complete point-of-sale system deployment across 50+ restaurant locations with custom integrations.",
      image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
      category: "Restaurant",
      technologies: ["POS System", "Inventory Management", "Cloud Integration"],
      color: "from-digitek-pink to-digitek-purple",
      client: "FastBite Restaurant Chain",
      year: "2023",
      challenge: `
        <p>FastBite Chain, a rapidly growing quick-service restaurant with over 50 locations across the country, was facing significant operational challenges with their legacy point-of-sale system:</p>
        
        <ul>
          <li>Inconsistent order processing times leading to long customer wait times</li>
          <li>Frequent system crashes during peak hours resulting in lost sales</li>
          <li>Inability to integrate with modern delivery platforms</li>
          <li>Manual inventory management processes causing stockouts and waste</li>
          <li>Lack of centralized reporting for multi-location management</li>
        </ul>
        
        <p>The company's expansion plans were being hindered by these technological limitations, and they needed a scalable solution that could grow with their business while addressing their current pain points.</p>
      `,
      solution: `
        <p>Idigitek Solutions designed and implemented a comprehensive POS system tailored specifically to FastBite's unique requirements:</p>
        
        <h4>Hardware Deployment</h4>
        <ul>
          <li>Durable, water-resistant touchscreen terminals at all service points</li>
          <li>High-speed kitchen display systems with customizable layouts</li>
          <li>Integrated payment processing terminals with contactless capabilities</li>
          <li>Backup systems with automatic failover to prevent downtime</li>
        </ul>
        
        <h4>Software Implementation</h4>
        <ul>
          <li>Cloud-based POS software with offline functionality during internet outages</li>
          <li>Custom menu management system with dayparting and location-specific offerings</li>
          <li>Integrated inventory management with automatic reordering thresholds</li>
          <li>Real-time sales analytics and reporting dashboard</li>
          <li>Staff management and scheduling tools with performance tracking</li>
        </ul>
        
        <h4>Integration Services</h4>
        <ul>
          <li>API connections to major delivery platforms (UberEats, DoorDash, GrubHub)</li>
          <li>Integration with FastBite's existing loyalty program</li>
          <li>Accounting system integration for streamlined financial reporting</li>
          <li>Custom middleware for legacy system data migration</li>
        </ul>
        
        <p>The implementation was rolled out in phases, with pilot locations receiving the system first to identify and address any issues before company-wide deployment.</p>
      `,
      results: `
        <p>The new POS system transformed FastBite's operations, delivering significant measurable improvements:</p>
        
        <ul>
          <li><strong>30% reduction in order processing time</strong>, significantly improving customer throughput during peak hours</li>
          <li><strong>99.9% system uptime</strong>, eliminating the lost sales previously experienced during system crashes</li>
          <li><strong>25% increase in delivery orders</strong> through seamless integration with third-party platforms</li>
          <li><strong>18% reduction in food waste</strong> due to improved inventory management and forecasting</li>
          <li><strong>15% increase in average ticket size</strong> through strategic upsell prompts in the POS interface</li>
        </ul>
        
        <p>Beyond these metrics, FastBite's management now has unprecedented visibility into their operations across all locations, enabling data-driven decision making for menu optimization, staffing, and future expansion planning.</p>
        
        <p>The system's scalability has already been proven with the successful addition of 5 new locations since implementation, each brought online in less than 48 hours with minimal IT support required.</p>
      `,
      testimonial: {
        quote:
          "Idigitek's POS solution has revolutionized how we operate. The system is intuitive for our staff, reliable during our busiest periods, and provides the data we need to make smart business decisions. It's been a game-changer for our expansion plans.",
        author: "Maria Rodriguez",
        role: "Operations Director, FastBite Chain",
      },
      gallery: [
        "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
      ],
    },
    {
      id: "2",
      title: "RetailPlus Inventory Solution",
      description: "AI-powered inventory management system that reduced stockouts by 30% and improved efficiency.",
      image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
      category: "Retail",
      technologies: ["AI Analytics", "Inventory Tracking", "Automated Ordering"],
      color: "from-blue-500 to-indigo-500",
      client: "RetailPlus Group",
      year: "2023",
      challenge: `
        <p>RetailPlus Group, a mid-sized retail chain with 25 locations specializing in consumer electronics, was struggling with inventory management challenges that were directly impacting their bottom line:</p>
        
        <ul>
          <li>Frequent stockouts of popular items resulting in lost sales opportunities</li>
          <li>Excess inventory of slow-moving products tying up capital</li>
          <li>Manual inventory counts consuming significant staff time</li>
          <li>Inconsistent ordering practices across different store locations</li>
          <li>Limited visibility into inventory movement and product performance</li>
        </ul>
        
        <p>These issues were particularly problematic in the fast-moving consumer electronics sector, where product lifecycles are short and customer expectations for immediate availability are high.</p>
      `,
      solution: `
        <p>Idigitek Solutions developed and implemented a comprehensive AI-powered inventory management system tailored to RetailPlus Group's specific needs:</p>
        
        <h4>Core System Components</h4>
        <ul>
          <li>Real-time inventory tracking across all locations with RFID integration</li>
          <li>AI-driven demand forecasting engine that analyzes historical sales data, seasonal trends, and external factors</li>
          <li>Automated reordering system with customizable thresholds and approval workflows</li>
          <li>Centralized inventory management dashboard with role-based access controls</li>
          <li>Mobile inventory management tools for in-store staff</li>
        </ul>
        
        <h4>Advanced Features</h4>
        <ul>
          <li>Predictive analytics for new product introductions based on similar product performance</li>
          <li>Intelligent stock balancing between locations to optimize inventory distribution</li>
          <li>Vendor performance tracking and automated communication</li>
          <li>Markdown optimization for aging inventory</li>
          <li>Integration with POS system for real-time inventory adjustments</li>
        </ul>
        
        <p>The implementation included comprehensive staff training and a phased rollout approach to ensure smooth adoption across all locations.</p>
      `,
      results: `
        <p>The new inventory management system delivered transformative results for RetailPlus Group:</p>
        
        <ul>
          <li><strong>30% reduction in stockouts</strong> of high-demand items, directly increasing sales</li>
          <li><strong>25% decrease in excess inventory</strong>, freeing up significant working capital</li>
          <li><strong>40% reduction in time spent on inventory management tasks</strong> by store staff</li>
          <li><strong>15% improvement in gross margins</strong> through optimized purchasing and reduced markdowns</li>
          <li><strong>20% increase in inventory turn rate</strong>, improving overall supply chain efficiency</li>
        </ul>
        
        <p>The system's AI-driven forecasting has proven particularly valuable during seasonal peaks and promotional events, accurately predicting demand spikes and ensuring adequate stock levels without overstocking.</p>
        
        <p>Store managers now have clear visibility into inventory performance metrics and can make data-driven decisions about merchandising and product assortment. At the corporate level, executives have gained unprecedented insights into inventory performance across the entire chain, enabling more strategic purchasing and vendor negotiations.</p>
      `,
      testimonial: {
        quote:
          "The custom software Idigitek developed for our inventory management has eliminated stockouts and reduced waste by 30%. Their team was professional and responsive throughout the implementation process, and the ongoing support has been exceptional.",
        author: "James Wilson",
        role: "CTO, RetailPlus Group",
      },
      gallery: [
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
        ],
    },
    {
      id: "3",
      title: "Quick Serve Drive-Through Optimization",
      description: "Comprehensive drive-through timing system that reduced wait times by 40% across 25 locations.",
      image: "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
      category: "Restaurant",
      technologies: ["Real-time Analytics", "Customer Display", "Staff Optimization"],
      color: "from-emerald-500 to-teal-500",
      client: "Quick Serve Inc.",
      year: "2022",
      challenge: `
        <p>Quick Serve Inc., a regional fast-food chain with 25 locations, was facing significant challenges with their drive-through operations:</p>
        
        <ul>
          <li>Consistently long wait times during peak hours leading to customer dissatisfaction</li>
          <li>Inconsistent service speeds across different locations</li>
          <li>No visibility into bottlenecks in the drive-through process</li>
          <li>Difficulty optimizing staffing levels for varying traffic patterns</li>
          <li>Limited data for performance evaluation and improvement</li>
        </ul>
        
        <p>With over 70% of their business coming through the drive-through, these issues were directly impacting customer satisfaction, repeat business, and overall profitability.</p>
      `,
      solution: `
        <p>Idigitek Solutions designed and implemented a comprehensive drive-through optimization system with multiple integrated components:</p>
        
        <h4>Hardware Installation</h4>
        <ul>
          <li>AI-powered camera systems at key points in the drive-through lane</li>
          <li>Vehicle detection sensors for accurate timing measurements</li>
          <li>Digital menu boards with dynamic content capabilities</li>
          <li>Customer-facing wait time displays</li>
          <li>Kitchen display systems optimized for drive-through order sequencing</li>
        </ul>
        
        <h4>Software Implementation</h4>
        <ul>
          <li>Real-time analytics dashboard showing current performance metrics</li>
          <li>Predictive traffic modeling based on historical patterns and external factors</li>
          <li>Staff positioning optimization algorithms</li>
          <li>Automated order confirmation system to improve accuracy</li>
          <li>Performance benchmarking across locations</li>
        </ul>
        
        <p>The system was designed to not only measure performance but actively suggest improvements in real-time, such as opening additional service windows during unexpected traffic surges or adjusting staff positioning to address bottlenecks.</p>
      `,
      results: `
        <p>The drive-through optimization system delivered exceptional results across all Quick Serve locations:</p>
        
        <ul>
          <li><strong>40% reduction in average wait times</strong> during peak hours</li>
          <li><strong>25% increase in drive-through throughput</strong> (vehicles served per hour)</li>
          <li><strong>15% improvement in order accuracy</strong> through the automated confirmation system</li>
          <li><strong>20% reduction in labor costs</strong> through optimized staffing based on predicted traffic patterns</li>
          <li><strong>10% increase in repeat customer visits</strong> as measured through loyalty program data</li>
        </ul>
        
        <p>Beyond these operational improvements, the system has provided valuable insights that have led to process refinements throughout the organization. For example, analysis of order timing data revealed that certain menu combinations were consistently causing delays in preparation, leading to menu optimization that improved both kitchen efficiency and customer satisfaction.</p>
        
        <p>The customer-facing wait time displays have also had a significant positive impact on perceived service quality, with customer satisfaction scores increasing by 18% even in instances where actual wait times were only moderately improved.</p>
      `,
      testimonial: {
        quote:
          "The ROI on this system has been remarkable. We've seen increased throughput during peak hours, improved staff efficiency, and most importantly, happier customers who keep coming back. The data insights have transformed how we approach our operations.",
        author: "Thomas Wright",
        role: "Operations Manager, Quick Serve Inc.",
      },
      gallery: [
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
          "https://images.unsplash.com/photo-1572177812156-58036aae439c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHN8ZW58MHx8MHx8fDA%3D",
        ],
    },
  ]