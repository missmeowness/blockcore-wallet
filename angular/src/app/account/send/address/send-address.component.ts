import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Big from 'big.js';
import { InputValidators } from 'src/app/services/inputvalidators';
import { SATOSHI_FACTOR } from 'src/app/shared/constants';
import { WalletManager, UIState, SendService, NetworkStatusService } from '../../../services';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

@Component({
    selector: 'app-account-send-address',
    templateUrl: './send-address.component.html',
    styleUrls: ['./send-address.component.css']
})
export class AccountSendAddressComponent implements OnInit, OnDestroy {
    form: FormGroup;
    optionsOpen = false;
    amountTooLarge = false;

    get optionAmountInput() {
        return this.form.get('amountInput') as FormControl;
    }

    get optionFeeInput() {
        return this.form.get('feeInput') as FormControl;
    }

    constructor(
        public uiState: UIState,
        public sendService: SendService,
        public walletManager: WalletManager,
        public networkStatusService: NetworkStatusService,
        private ngZone: NgZone,
        private fb: FormBuilder) {

        this.form = fb.group({
            addressInput: new FormControl('', [Validators.required, Validators.minLength(6)]),
            changeAddressInput: new FormControl('', []),
            amountInput: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern(/^-?(0|[0-9]+[.]?[0-9]*)?$/), InputValidators.maximumBitcoin(sendService)]),
            // TODO: Make an custom validator that sets form error when fee input is too low.
            feeInput: new FormControl(this.sendService.getNetworkFee(), [Validators.required, Validators.min(0), Validators.pattern(/^-?(0|[0-9]+[.]?[0-9]*)?$/)])
        });

        this.optionFeeInput.valueChanges.subscribe(value => {
            this.sendService.fee = value;
            this.optionAmountInput.updateValueAndValidity();
            this.optionAmountInput.markAsTouched();
        });

        const networkStatus = this.networkStatusService.get(this.sendService.network.id);
        this.sendService.feeRate = networkStatus[0].relayFee;
    }

    ngOnDestroy() {

    }

    async ngOnInit() {
    }

    scanQrCode() {
        let config: any = {
            fps: 10,
            qrbox: {
                width: 250, height: 250
            },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        };

        let html5QrcodeScanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);

        html5QrcodeScanner.render((decodedText: any, decodedResult: any) => {
            this.onScanSuccess(decodedText, decodedResult);
        }, (error) => {
            this.onScanFailure(error);
        });
    }

    onScanSuccess(decodedText: any, decodedResult: any) {
        this.ngZone.run(() => {
            // handle the scanned code as you like, for example:
            console.log(`Code matched = ${decodedText}`, decodedResult);
            this.sendService.address = decodedText;
        });
    }

    onScanFailure(error: any) {
        this.ngZone.run(() => {
            // handle scan failure, usually better to ignore and keep scanning.
            // for example:
            console.warn(`Code scan error = ${error}`);
        });
    }

    fillMax(amount?: number) {
        this.sendService.setMax(new Big(amount));
    }

    toggleOptions() {
        this.optionsOpen = !this.optionsOpen;
    }

    getErrorMessage() {
        if (this.form.get('addressInput').hasError('required')) {
            return 'You must enter a value';
        }

        return this.form.get('addressInput').hasError('email') ? 'Not a valid email' : '';
    }
}