import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';

// ✅ Clarity Icons
import { ClarityIcons } from '@cds/core/icon';
import { cogIcon } from '@cds/core/icon/shapes/cog.js';
import { trashIcon, pencilIcon, userIcon } from '@cds/core/icon';

// ✅ Charts (IMPORTANT)
import 'chart.js/auto';

// ✅ Clarity styles
import '@cds/core/global.min.css';
import '@cds/core/progress-circle/register.js';
import { authInterceptor } from './app/auth.interceptor';

// Register icons
ClarityIcons.addIcons(cogIcon, trashIcon, pencilIcon, userIcon);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimations(),

    // ✅ FIX: spread providers properly
    ...appConfig.providers
  ]
}).catch(err => console.error(err));


