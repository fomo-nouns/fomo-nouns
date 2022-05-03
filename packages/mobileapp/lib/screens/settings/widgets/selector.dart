import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:rive/rive.dart';

class Selector extends StatefulWidget {
  const Selector({
    Key? key,
    this.type,
    required this.text,
    required this.value,
    required this.onChange,
  }) : super(key: key);

  final String text;
  final bool value;
  final Function(bool) onChange;
  final String? type;

  @override
  _SelectorState createState() => _SelectorState();
}

class _SelectorState extends State<Selector> {
  /// Boolean state to control switch look and change animation
  SMIBool? _on;

  late bool _value;

  @override
  void initState() {
    _value = widget.value;
    super.initState();
  }

  void _onRiveInit(Artboard artboard) {
    final controller = _value
        ? StateMachineController.fromArtboard(
            artboard,
            RiveStateMachines.onSwitch,
          )
        : StateMachineController.fromArtboard(
            artboard,
            RiveStateMachines.offSwitch,
          );

    artboard.addController(controller!);
    _on = controller.findInput<bool>(RiveStateMachines.onInstance) as SMIBool;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          widget.text,
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.w500,
            letterSpacing: -0.5.sp,
          ),
        ),
        GestureDetector(
          onTap: () {
            setState(() {
              _value = !_value;
              _on?.change(_value);
              widget.onChange(_value);
            });
          },
          child: Container(
            padding: EdgeInsets.only(
              top: 10.w,
              left: 10.w,
              bottom: 10.w,
            ),
            color: AppColors.transparent,
            height: 55.w,
            width: 85.w,
            child: RiveAnimation.asset(
              RivePaths.settingsSwitch,
              animations: const [''],
              onInit: _onRiveInit,
              fit: BoxFit.fitHeight,
              alignment: Alignment.centerRight,
            ),
          ),
        ),
      ],
    );
  }
}
