import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlphVantageService {
  protected BASE_URL = 'https://www.alphavantage.co/query?';
  protected API_KEY = environment.API_KEY;
}
