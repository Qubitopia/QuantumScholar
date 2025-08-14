import { PDFViewer } from '@react-pdf/renderer';
import Invoice from '../components/pdf/invoice.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
const styles = {
  main: {
    display: 'flex',
    height: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)'
  },
  leftSection: {
    overflowY: 'auto',
    height: '100vh',
    padding: '2rem',
    width: '50%',
    backgroundColor: 'var(--bg-elev)', /* Themed background */
    borderRight: '1px solid var(--border)',
  },
  rightSection: {
    overflowY: 'auto',
    height: '100vh',
    padding: '2rem',
    width: '50%',
    backgroundColor: 'var(--bg-elev)', /* Themed background for PDF viewer */
    color: 'var(--text)'
  }
};
function Classroom() {
  return (
    <>
    <Navbar />

    <div style={styles.main}>
      <div style={styles.leftSection}>
        <h1 className="text-primary">Left Section</h1>
        <p>View the PDF document on the right.</p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum enim fuga animi excepturi asperiores tempora aut quidem, sint totam, nam repellat repellendus esse neque beatae dolor ipsa voluptatum sapiente ut.
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique itaque ipsum dignissimos iste? Eveniet quasi porro minima nostrum, repudiandae rerum labore sint doloremque aliquam fugiat in explicabo possimus, cupiditate a!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, enim. Ipsum debitis incidunt, iure quo ea reprehenderit quaerat impedit natus veniam nobis, cum adipisci! Voluptate quas explicabo incidunt aspernatur? Omnis.

        {/* ...rest of your content... */}
      </div>
      <div style={styles.rightSection}>
        <h2 className="mb-3">PDF Viewer</h2>
        <PDFViewer width="100%" height="95%" style={{ border: 'none' }}>
          <Invoice />
        </PDFViewer>
      </div>
      
    </div>
    <Footer />
    </>
  );
}
export default Classroom;